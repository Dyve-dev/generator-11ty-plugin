import Debug from 'debug';
import { PluginOptions } from './types';

const debug = Debug('<%= projectScope %>:11typlugin');

const defaults: PluginOptions = {};

export default {
  initArguments: {},
  configFunction: async (eleventyConfig: any, options?: PluginOptions) => {
    console.log('new plugin');
  },
};
