const fetch = require('isomorphic-unfetch');
const qs = require('qs');

const MIME_TYPE_JSON = 'application/json';
const HOST = 'https://api.one.accedo.tv';
const credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
const defaultHeaders = { accept: MIME_TYPE_JSON };

const getForwardedForHeader = ({ ip }) => {
  if (!ip) {
    return {};
  }
  return { 'X-FORWARDED-FOR': ip };
};

const getSessionHeader = ({ sessionKey, useSessionKeyAsQuerystringParam }) => {
  if (!sessionKey || useSessionKeyAsQuerystringParam) {
    return {};
  }
  return { 'X-SESSION': sessionKey };
};

const getContentTypeHeader = () => ({ 'Content-Type': MIME_TYPE_JSON });

const getQueryString = (config, existingQs = {}) => {
  // When there is a sessionKey, these are useless
  const defaultQs = config.sessionKey
    ? {}
    : {
        appKey: config.appKey,
        uuid: config.deviceId,
      };

  if (config.gid) {
    defaultQs.gid = config.gid;
  }

  // When [config.useSessionKeyAsQuerystringParam] is true the sessionKey will be sent as querystring param
  if (config.sessionKey && config.useSessionKeyAsQuerystringParam) {
    defaultQs.sessionKey = config.sessionKey;
  }

  const qsObject = Object.assign({}, existingQs, defaultQs);
  const queryString = qs.stringify(qsObject);
  return queryString;
};

const getRequestUrlWithQueryString = (path, config) => {
  const { target = HOST } = config;
  const splitUrl = path.split('?');
  const pathWithoutQs = splitUrl[0];
  const existingQs = qs.parse(splitUrl[1]);
  const queryString = getQueryString(config, existingQs);
  return `${target}${pathWithoutQs}?${queryString}`;
};

const getExtraHeaders = config => {
  return Object.assign(
    {},
    getForwardedForHeader(config),
    getSessionHeader(config)
  );
};

const getFetch = (path, config) => {
  const headers = Object.assign({}, defaultHeaders, getExtraHeaders(config));
  const requestUrl = getRequestUrlWithQueryString(path, config);
  config.log(
    `Sending a GET request to: ${requestUrl} with the following headers`,
    headers
  );
  return fetch(requestUrl, { credentials, headers }).then(res => {
    if (res.status >= 400) {
      config.log('GET failed with status', res.status);
      throw res;
    }
    return res;
  });
};

module.exports.grab = (path, config) => {
  config.log('Requesting', path);
  return getFetch(path, config)
    .then(res => res.json())
    .then(response => {
      config.log('GET response', response);
      return response;
    });
};

module.exports.post = (path, config, body = {}, sendRaw) => {
  const headers = Object.assign(
    {},
    defaultHeaders,
    getContentTypeHeader(),
    getExtraHeaders(config)
  );
  const requestUrl = getRequestUrlWithQueryString(path, config);
  config.log(
    `Sending a POST request to: ${requestUrl}. With the following headers and body: `,
    headers,
    body
  );
  const options = {
    headers,
    credentials,
    method: 'post',
    body: sendRaw ? body : JSON.stringify(body),
  };
  return fetch(requestUrl, options).then(({ status, statusText }) => {
    if (status !== 200) {
      throw new Error(
        `Accedo One POST request returned a non-200 response. Status Code: ${status}. Status Text: ${statusText}`
      );
    }
    const result = { status, statusText };
    config.log('POST response: ', result);
    return result;
  });
};
