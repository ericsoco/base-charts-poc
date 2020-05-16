// @flow
import React, { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';

import { radialProperties } from './chart-props';
import { validateEncodings, getXYEncodings } from '../validation';
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
  x,
  y,
}: $ReadOnly<{|
  x: Field,
  y: Field,
|}>): Datum => NivoRadialDatum {
  // TODO: Validate datatypes in validation step and remove typecast
  return d =>
    ({
      id: d[x.key],
      label: d[x.key],
      value: d[y.key],
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
  const validation = validateEncodings(data, getXYEncodings(config));
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const dataMapper = mapToNivoDatum({
    x: config.x,
    y: config.y,
  });
  const nivoData = data.map(dataMapper);

  return {
    data: nivoData,
  };
}

/**
 * Derive Nivo props from Base Charts config and default Nivo props.
 * Infers static typing from chart type default props.
 */
// eslint-disable-next-line no-unused-vars
function getChartProps(config) {
  // TODO: support custom formatting for labels/tooltips/legends
  // e.g. via getXYPropsOverrides
  return radialProperties;
}

export default function BaseRadial({ data, config }: Props) {
  const encodingProps = useMemo(() => getEncodingProps(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config), [config]);
  return <ResponsivePie {...chartProps} {...encodingProps} />;
}
