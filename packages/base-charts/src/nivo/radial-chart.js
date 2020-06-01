// @flow
import React, { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';

import { radialProperties } from './chart-props';
import { useTheme, type Theme } from '../theme';
import { validateEncodings } from '../validation';
import {
  type Dataset,
  type Datum,
  type Field,
  type RadialConfig,
  type RadialProps as Props,
} from '../input-types';

type NivoRadialDatum = $ReadOnly<{|
  label: string,
  value: number | null,
|}>;
type NivoEncodingProps = $ReadOnly<{|
  data: $ReadOnlyArray<NivoRadialDatum>,
|}>;

function mapToNivoDatum({
  key,
  value,
}: $ReadOnly<{|
  key: Field,
  value: Field,
|}>): Datum => NivoRadialDatum {
  // TODO: Validate datatypes in validation step and remove typecast
  return d =>
    ({
      id: d[key.key],
      label: d[key.key],
      value: d[value.key],
      // flowlint-next-line unclear-type:off
    }: any);
}

/**
 * Convert Base Charts config to Nivo channel encoding props.
 */
export function getEncodingProps(
  data: Dataset,
  config: RadialConfig
): NivoEncodingProps {
  // TODO: Fix this
  // flowlint-next-line unclear-type:off
  const validation = validateEncodings(data, (config: any));
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const dataMapper = mapToNivoDatum({
    key: config.key,
    value: config.value,
  });
  const nivoData = data.map(dataMapper);

  return {
    data: nivoData,
  };
}

const DONUT_INNER_RADIUS = 0.8;
const DONUT_PAD_ANGLE = 0.7;

/**
 * Derive Nivo props from Base Charts config and default Nivo props.
 * Infers static typing from chart type default props.
 */
function getChartProps(config: RadialConfig, theme: Theme) {
  return {
    ...radialProperties,
    colors: theme.colors,
    innerRadius: config.options?.layout === 'pie' ? 0 : DONUT_INNER_RADIUS,
    padAngle: config.options?.layout === 'pie' ? 0 : DONUT_PAD_ANGLE,
  };
}

export default function BaseRadial({ data, config }: Props) {
  const theme = useTheme();
  const encodingProps = useMemo(() => getEncodingProps(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config, theme), [config]);
  return <ResponsivePie {...chartProps} {...encodingProps} />;
}
