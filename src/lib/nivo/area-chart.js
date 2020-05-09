// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { getEncodingProps as convertToNivoLine } from './line-chart';
import { areaProperties } from './chart-props';
import { getXYPropsOverrides } from './chart-props-utils';
import { type AreaProps as Props } from '../input-types';

/**
 * Derive Nivo props from Base Charts config and default Nivo props.
 * Infers static typing from chart type default props.
 */
function getChartProps(config) {
  const overrides = getXYPropsOverrides(config);
  return {
    ...areaProperties,
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
  };
}

export default function BaseArea({ data, config }: Props) {
  const encodingProps = useMemo(() => convertToNivoLine(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config), [config]);
  return <ResponsiveLine {...chartProps} {...encodingProps} />;
}
