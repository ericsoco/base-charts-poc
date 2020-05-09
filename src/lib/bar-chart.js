// @flow
import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { barProperties } from './chart-props';
import { getXYPropsOverrides } from './chart-props-utils';
import { validateEncodings, getXYEncodings } from './validation';
import { keys } from './utils';
import {
  type Dataset,
  type BarConfig,
  type BarProps as Props,
} from './input-types';

type NivoEncodingProps = $ReadOnly<{|
  indexBy: string,
  keys: $ReadOnlyArray<string>,
  groupMode: 'grouped' | 'stacked',
  layout: 'vertical' | 'horizontal',
  enableGridX: boolean,
  enableGridY: boolean,
|}>;

/**
 * Convert Base Charts config to Nivo channel encoding props.
 */
function getEncodingProps(data: Dataset, config: BarConfig): NivoEncodingProps {
  const validation = validateEncodings(data, getXYEncodings(config));
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const orientation = config.options?.orientation;
  const isHorizontal = orientation === 'horizontal';

  return {
    indexBy: config.x.key,
    keys: keys(config.y),
    groupMode: config.options?.stack ? 'stacked' : 'grouped',
    layout: isHorizontal ? 'horizontal' : 'vertical',
    enableGridX: isHorizontal,
    enableGridY: !isHorizontal,
  };
}

/**
 * Derive Nivo props from Base Charts config and default Nivo props.
 * Infers static typing from chart type default props.
 */
function getChartProps(config) {
  const overrides = getXYPropsOverrides(config);
  return {
    ...barProperties,
    ...overrides,
    axisBottom: {
      ...barProperties.axisBottom,
      ...overrides.axisBottom,
      legend: config.x.key,
    },
    axisLeft: {
      ...barProperties.axisLeft,
      ...overrides.axisLeft,
      legend: keys(config.y).join(','),
    },
  };
}

export default function BaseBar({ data, config }: Props) {
  const encodingProps = useMemo(() => getEncodingProps(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config), [config]);
  return <ResponsiveBar data={data} {...chartProps} {...encodingProps} />;
}
