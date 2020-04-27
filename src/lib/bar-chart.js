// @flow
import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { barProperties } from './chart-props';
import { validateEncodings, getXYEncodings } from './validation';
import { keys } from './utils';
import {
  type Dataset,
  type BarConfig,
  type BarProps as Props,
} from './input-types';

type NivoProps = $ReadOnly<{|
  indexBy: string,
  keys: $ReadOnlyArray<string>,
  groupMode: 'grouped' | 'stacked',
|}>;

/**
 * Convert Base Charts config to Nivo props.
 */
function convertToNivo(data: Dataset, config: BarConfig): NivoProps {
  const validation = validateEncodings(data, getXYEncodings(config));
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  return {
    indexBy: config.x.key,
    keys: keys(config.y),
    groupMode: config.options?.stack ? 'stacked' : 'grouped',
  };
}

export default function BaseBar({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveBar data={data} {...barProperties} {...nivoProps} />;
}
