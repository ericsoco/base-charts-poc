// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { getEncodingProps as convertToNivoLine } from './line-chart';
import { areaProperties } from './chart-props';
import { getSliceTooltipProps, getXYPropsOverrides } from './chart-props-utils';
import { useTheme, type Theme } from '../theme';
import { type AreaProps as Props } from '../input-types';

/**
 * Derive Nivo props from Base Charts config and default Nivo props.
 * Infers static typing from chart type default props.
 */
function getChartProps(config, theme: Theme) {
  const overrides = getXYPropsOverrides(config);
  return {
    ...areaProperties,
    colors: theme.colors,
    ...overrides,
    axisBottom: {
      ...areaProperties.axisBottom,
      ...overrides.axisBottom,
    },
    axisLeft: {
      ...areaProperties.axisLeft,
      ...overrides.axisLeft,
    },
    yScale: {
      ...overrides.yScale,
      stacked: true,
      reverse: false,
    },
    ...getSliceTooltipProps(config),
  };
}

export default function BaseArea({ data, config }: Props) {
  const theme = useTheme();
  const encodingProps = useMemo(() => convertToNivoLine(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config, theme), [config]);
  return <ResponsiveLine {...chartProps} {...encodingProps} />;
}
