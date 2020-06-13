// @flow
import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { barProperties } from './chart-props';
import { getPointTooltipProps, getXYPropsOverrides } from './chart-props-utils';
import { useTheme, type Theme } from '../theme';
import { validateEncodings, getXYEncodings } from '../validation';
import { keys } from '../utils';
import {
  type Dataset,
  type BarConfig,
  type BarProps as Props,
} from '../input-types';

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
function getChartProps(config, theme: Theme) {
  const overrides = getXYPropsOverrides(config);
  return {
    ...barProperties,
    colors: theme.colors,
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
    ...getPointTooltipProps(),
  };
}

export default function BaseBar({ data, config }: Props) {
  const theme = useTheme();
  const encodingProps = useMemo(() => getEncodingProps(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config, theme), [config]);
  return <ResponsiveBar data={data} {...chartProps} {...encodingProps} />;
}
