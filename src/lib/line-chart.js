// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import {
  lineProperties,
  validateEncodings,
  type Dataset,
  type Datum,
  type EncodingsConfig,
  type XYConfig,
} from './chart-props';

type Props = $ReadOnly<{|
  config: BaseLineConfig,
  data: Dataset,
|}>;

export type BaseLineConfig = $ReadOnly<{|
  ...$Exact<XYConfig>,
|}>;

type NivoLineDatum = $ReadOnly<{|
  x: string,
  y: number | null,
|}>;
type NivoLineDataset = $ReadOnly<{|
  id: string,
  data: $ReadOnlyArray<NivoLineDatum>,
|}>;
type NivoProps = $ReadOnly<{|
  data: $ReadOnlyArray<NivoLineDataset>,
|}>;

function mapToNivoDatum({
  x,
  y,
}: $ReadOnly<{|
  x: string,
  y: string,
|}>): Datum => NivoLineDatum {
  // TODO: Validate datatypes in validation step and remove typecast
  return d =>
    ({
      x: d[x],
      y: d[y],
    }: any);
}

/**
 * Isolate only the channel encodings in a config
 * TODO: Use opaque `Field: string` type instead
 */
function toEncodingsConfig(config: BaseLineConfig): EncodingsConfig {
  // eslint-disable-next-line no-unused-vars
  const { options, ...rest } = config;
  return rest;
}

/**
 * Convert Base Charts config to Nivo props.
 */
export function convertToNivo(
  data: Dataset,
  config: BaseLineConfig
): NivoProps {
  const validation = validateEncodings(data, toEncodingsConfig(config));
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const keys = Array.isArray(config.y) ? config.y : [config.y];
  const nivoData = keys.map(key => ({
    id: key,
    data: data.map(
      mapToNivoDatum({
        x: config.x,
        y: key,
      })
    ),
  }));

  return {
    data: nivoData,
  };
}

export default function BaseLine({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveLine {...lineProperties} {...nivoProps} />;
}
