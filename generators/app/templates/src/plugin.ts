import Debug from 'debug';
import { PluginOptions } from './types';

const debug = Debug(
  '<%= scope ? scope+":" : "" %>11typlugin<%= pluginName ? ":"+pluginName : "" %>'
);

const defaults: PluginOptions = {};

export const plugin = {
  initArguments: {},
  configFunction: async (eleventyConfig: any, options?: PluginOptions) => {
    console.log('new plugin');
  },
};
