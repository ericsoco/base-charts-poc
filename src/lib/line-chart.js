// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { lineProperties, datatypeToScaleType } from './chart-props';
import { validateEncodings, getXYEncodings } from './validation';
import { keys } from './utils';
import {
  DATATYPES,
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

type NivoAxisOverrides = {
  format?: string,
  legend: string,
};
type NivoXScale = {
  // TODO: enumerate these in chart-props and use in datatypeToScaleType
  type: 'point' | 'linear' | 'time',
  format?: string,
  // TODO: enumerate available values from Nivo
  precision?: string,
};
type NivoOverrides = $ReadOnly<{|
  axisBottom: NivoAxisOverrides,
  axisLeft: NivoAxisOverrides,
  xScale: NivoXScale,
  xFormat?: string,
  yFormat?: string,
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

/**
 * Derive overrides for chart properties from Base Charts config.
 * TODO: Much of this is generalizable to other XY chart types;
 * move it somewhere accessible to those.
 */
function getPropsOverrides(config: LineConfig): NivoOverrides {
  // Derive input formatting
  const xScaleFormatting = config.x.format
    ? {
        format: config.x.format,
        // TODO: how to / should we expose this in Base Charts API?
        precision: 'day',
      }
    : {};
  const xScale = {
    type: datatypeToScaleType[config.x.type],
    ...xScaleFormatting,
  };

  // Derive axis label formatting
  const axis = config.options?.axis;

  const axisXFormat = axis?.x?.format || config.x.format;
  const axisBottom = {
    ...lineProperties.axisBottom,
    ...(axisXFormat ? { format: axisXFormat } : {}),
    legend: axis?.x?.label || config.x.key,
  };

  const axisYFormat = axis?.y?.format;
  const axisLeft = {
    ...lineProperties.axisLeft,
    ...(axisYFormat !== null ? { format: axisYFormat } : {}),
    legend: axis?.y?.label || keys(config.y).join(','),
  };

  // Derive label/tooltip formatting
  const xIsTime = config.x.type === DATATYPES.TIME;
  const labelsXFormat = config.options?.labels?.format?.x;
  const labelsYFormat = config.options?.labels?.format?.y;
  const xFormat = labelsXFormat
    ? `${xIsTime ? 'time:' : ''}${labelsXFormat}`
    : null;
  const yFormat = labelsYFormat || null;

  // Sometimes Flow makes my eyes bleed
  // https://github.com/facebook/flow/issues/8186
  const xf: $ReadOnly<{|
    xFormat?: string,
  |}> = xFormat ? { xFormat } : { ...null };
  const yf: $ReadOnly<{|
    yFormat?: string,
  |}> = yFormat ? { yFormat } : { ...null };

  return {
    axisBottom,
    axisLeft,
    xScale,
    ...xf,
    ...yf,
  };
}

export default function BaseLine({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return (
    <ResponsiveLine
      {...lineProperties}
      {...getPropsOverrides(config)}
      {...nivoProps}
    />
  );
}
