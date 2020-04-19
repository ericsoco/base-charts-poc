// @flow
import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import {
  barProperties,
  validateEncodings,
  type Dataset,
  type EncodingsConfig,
  type XYConfig,
} from './chart-props';

type Props = $ReadOnly<{|
  config: BaseBarConfig,
  data: Dataset,
|}>;

export type BaseBarConfig = $ReadOnly<{|
  ...$Exact<XYConfig>,
  stack?: boolean,
|}>;

type NivoProps = $ReadOnly<{|
  indexBy: string,
  keys: $ReadOnlyArray<string>,
  groupMode: 'grouped' | 'stacked',
|}>;

/**
 * Isolate only the channel encodings in a config
 * TODO: Use opaque `Field: string` type instead
 */
function toEncodingsConfig(config: BaseBarConfig): EncodingsConfig {
  // eslint-disable-next-line no-unused-vars
  const { stack, ...rest } = config;
  return rest;
}

/**
 * Convert Base Charts config to Nivo props.
 */
function convertToNivo(data: Dataset, config: BaseBarConfig): NivoProps {
  const validation = validateEncodings(data, toEncodingsConfig(config));
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  return {
    indexBy: config.x,
    keys: Array.isArray(config.y) ? config.y : [config.y],
    groupMode: config.stack ? 'stacked' : 'grouped',
  };
}

export default function BaseBar({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveBar data={data} {...barProperties} {...nivoProps} />;
}
