// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { lineProperties } from './chart-props';
import { validateEncodings } from './validation';
import {
  type Dataset,
  type Datum,
  type LineConfig,
  type LineProps as Props,
} from './input-types';

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
 * Convert Base Charts config to Nivo props.
 */
export function convertToNivo(data: Dataset, config: LineConfig): NivoProps {
  const validation = validateEncodings(data, config, 'Line');
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
