import { axBaseAIDefaultConfig } from '../base.js';
import { AxAIOpenAI } from '../openai/api.js';
import type { AxAIOpenAIConfig } from '../openai/types.js';
import type { AxAIServiceOptions } from '../types.js';

import { axModelInfoTogether } from './info.js';

type TogetherAIConfig = AxAIOpenAIConfig;

export const axAITogetherDefaultConfig = (): TogetherAIConfig =>
  structuredClone({
    // cspell:disable-next-line
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    ...axBaseAIDefaultConfig()
  });

export interface AxAITogetherArgs {
  name: 'together';
  apiKey: string;
  config?: Readonly<Partial<TogetherAIConfig>>;
  options?: Readonly<AxAIServiceOptions>;
  modelMap?: Record<string, string>;
}

export class AxAITogether extends AxAIOpenAI {
  constructor({
    apiKey,
    config,
    options,
    modelMap
  }: Readonly<Omit<AxAITogetherArgs, 'name'>>) {
    if (!apiKey || apiKey === '') {
      throw new Error('Together API key not set');
    }
    const _config = {
      ...axAITogetherDefaultConfig(),
      ...config
    };
    super({
      apiKey,
      config: _config,
      options,
      apiURL: 'https://api.together.xyz/v1',
      modelInfo: axModelInfoTogether,
      modelMap
    });

    super.setName('Together');
  }
}
