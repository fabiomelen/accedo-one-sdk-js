/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import buble from 'rollup-plugin-buble';
import multiEntry from 'rollup-plugin-multi-entry'; // eslint-disable-line import/extensions

export default {
  entry: 'test/**/*.js',
  plugins: [buble(), multiEntry()],
  format: 'cjs',
  intro: 'require("source-map-support").install();',
  dest: 'build/test-bundle.js',
  sourceMap: true
};
