// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { lineProperties } from './chart-props';
import { getXYPropsOverrides } from './chart-props-utils';
import { validateEncodings, getXYEncodings } from './validation';
import {
  type Dataset,
  type Datum,
  type Field,
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
 * Convert Base Charts config to Nivo props.
 */
export function convertToNivo(data: Dataset, config: LineConfig): NivoProps {
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

function getPropsOverrides(config) {
  const overrides = getXYPropsOverrides(config);
  return {
    ...lineProperties,
    ...overrides,
    axisBottom: {
      ...lineProperties.axisBottom,
      ...overrides.axisBottom,
    },
    axisLeft: {
      ...lineProperties.axisLeft,
      ...overrides.axisLeft,
    },
  };
}

export default function BaseLine({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveLine {...getPropsOverrides(config)} {...nivoProps} />;
}
