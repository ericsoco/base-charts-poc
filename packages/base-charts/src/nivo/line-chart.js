// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { lineProperties } from './chart-props';
import { getSliceTooltipProps, getXYPropsOverrides } from './chart-props-utils';
import { useTheme, type Theme } from '../theme';
import { validateEncodings, getXYEncodings } from '../validation';
import {
  type Dataset,
  type Datum,
  type Field,
  type LineConfig,
  type LineProps as Props,
} from '../input-types';

type NivoLineDatum = $ReadOnly<{|
  x: string,
  y: number | null,
|}>;
type NivoLineDataset = $ReadOnly<{|
  id: string,
  data: $ReadOnlyArray<NivoLineDatum>,
|}>;
type NivoEncodingProps = $ReadOnly<{|
  data: $ReadOnlyArray<NivoLineDataset>,
|}>;

function mapToNivoDatum({
  x,
  y,
}: $ReadOnly<{|
  x: Field,
  y: Field,
|}>): Datum => NivoLineDatum {
  // TODO: Validate datatypes in validation step and remove typecast
  return d =>
    ({
      x: d[x.key],
      y: d[y.key],
      // flowlint-next-line unclear-type:off
    }: any);
}

/**
 * Convert Base Charts config to Nivo channel encoding props.
 */
export function getEncodingProps(
  data: Dataset,
  config: LineConfig
): NivoEncodingProps {
  const validation = validateEncodings(data, getXYEncodings(config));
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const fields = Array.isArray(config.y) ? config.y : [config.y];
  const nivoData = fields.map(field => ({
    id: field.key,
    data: data.map(
      mapToNivoDatum({
        x: config.x,
        y: field,
      })
    ),
  }));

  return {
    data: nivoData,
  };
}

/**
 * Derive Nivo props from Base Charts config and default Nivo props.
 * Infers static typing from chart type default props.
 */
function getChartProps(config, theme: Theme) {
  const overrides = getXYPropsOverrides(config);
  return {
    ...lineProperties,
    colors: theme.colors,
    ...overrides,
    axisBottom: {
      ...lineProperties.axisBottom,
      ...overrides.axisBottom,
    },
    axisLeft: {
      ...lineProperties.axisLeft,
      ...overrides.axisLeft,
    },
    yScale: {
      ...overrides.yScale,
      stacked: false,
      reverse: false,
    },
    ...getSliceTooltipProps(config),
  };
}

export default function BaseLine({ data, config }: Props) {
  const theme = useTheme();
  const encodingProps = useMemo(() => getEncodingProps(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config, theme), [config]);
  return <ResponsiveLine {...chartProps} {...encodingProps} />;
}
