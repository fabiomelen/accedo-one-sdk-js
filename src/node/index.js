const makeAccedoOne = require('./client');
const commonStamps = require('../commonStamps');
const appLogNode = require('../stamps/node/appLog');

const stamp = commonStamps.compose(appLogNode);

/**
 * Factory function to create an instance of an Accedo One client.
 *
 * You must get an instance before accessing any of the exposed client APIs.
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.appKey the application Key
 * @param  {string} [config.deviceId] the device identifier (if not provided, a uuid will be generated instead)
 * @param  {string} [config.sessionKey] the sessionKey (note a new one may be created when not given or expired)
 * @param  {string} [config.ip] the user's IP, given to Accedo One for every request this client will trigger (for geolocation).
 * @param  {function} [config.log] a function to use to see this SDK's logs
 * @param  {function} [config.onDeviceIdGenerated] callback to obtain the new deviceId, if one gets generated
 * @param  {function} [config.onSessionKeyChanged] callback to obtain the sessionKey, anytime a new one gets generated
 * @param  {string} [config.target] all APIs calls will use this as the base API URL (defaults to the Accedo One API URL)
 * @param  {boolean} [config.useSessionKeyAsQuerystringParam] all APIs call will set sessionKey as querystring param instead of custom header X-SESSION
 * @return {client}        an Accedo One client tied to the given params
 * @example
 * const accedoOne = require('@accedo/accedo-one');
 *
 * // when all info is available - use all of it !
 * const client = accedoOne({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID', sessionKey: 'SOME_SESSION_KEY' });
 *
 * // when there is no known sessionKey yet
 * const client2 = accedoOne({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID' });
 *
 * // when there is no known sessionKey or deviceId yet
 * const client3 = accedoOne({ appKey: 'MY_APP_KEY' });
 */
const accedoOne = makeAccedoOne(stamp);

module.exports = accedoOne;
