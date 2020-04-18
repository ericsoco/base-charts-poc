// @flow
import React, { useMemo } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { group, extent } from 'd3-array';

import {
  scatterplotProperties,
  validateConfig as validateAbstractConfig,
  type ConfigValidation,
  type Dataset,
  type Datum,
  type XYConfig,
} from './chart-props';

type Props = $ReadOnly<{|
  config: BaseScatterplotConfig,
  data: Dataset,
|}>;

/**
 * XY
 * size:
 * number: fixed size (px)
 * string: linear scale with domain derived from passed field and fixed range
 * Datum => number: full control
 * color: (categorical) field to use for color scale domain
 */
export type BaseScatterplotConfig = $ReadOnly<{|
  ...XYConfig,
  size: number | string | (Datum => number),
  color: string,
|}>;

type NivoScatterplotDatum = $ReadOnly<{|
  // id: string,  // present in nivo sample data, but is it required?
  x: number,
  y: number,
  size?: number,
|}>;
type NivoScatterplotDataset = $ReadOnly<{|
  id: string,
  data: $ReadOnlyArray<NivoScatterplotDatum>,
|}>;
type NivoProps = $ReadOnly<{|
  data: $ReadOnlyArray<NivoScatterplotDataset>,
|}>;

const DEFAULT_SIZE_RANGE = [2, 20];

function validateConfig(
  data: Dataset,
  config: BaseScatterplotConfig
): ConfigValidation {
  const validation = validateAbstractConfig(data, config);
  const errors = [
    ...(Array.isArray(config.y) && config.color
      ? [
          {
            field: null,
            error: new Error(
              'When `color` is specified, `y` must be encoded to a single field.'
            ),
          },
        ]
      : []),
  ];
  return {
    valid: validation.valid && errors.length === 0,
    errors: [...validation.errors, ...errors],
  };
}

function mapToNivoDatum({ x, y, size }) {
  return d => ({
    x: d[x],
    y: d[y],
    ...(size ? { size: d[size] } : {}),
  });
}

/**
 * Convert Base Charts config to Nivo props.
 */
export function convertToNivo(
  data: Dataset,
  config: BaseScatterplotConfig
): NivoProps {
  const validation = validateConfig(data, config);
  if (!validation.valid) {
    // TODO: surface errors
  }

  const size = typeof config.size === 'string' ? config.size : null;
  const nodeSize = size
    ? {
        key: 'size',
        values: extent(data, d => d[size]),
        sizes: DEFAULT_SIZE_RANGE,
      }
    : config.size;

  let nivoData;
  if (Array.isArray(config.y)) {
    // multi-series
    nivoData = config.y.map(key => ({
      id: key,
      data: data.map(
        mapToNivoDatum({
          x: config.x,
          y: key,
          size,
        })
      ),
    }));
  } else if (config.color) {
    // color by field
    // TODO: if group() returns a Map, will need to iterate differently
    // or convert to object...
    const grouped = group(data, d => d[config.color]);
    nivoData = Object.keys(grouped).map(key => ({
      id: key,
      data: grouped[key].map(
        mapToNivoDatum({
          x: config.x,
          y: key,
          size,
        })
      ),
    }));
  } else {
    // single-series
    nivoData = [
      {
        id: 'data',
        data: data.map(
          mapToNivoDatum({
            x: config.x,
            y: config.y,
            size,
          })
        ),
      },
    ];
  }

  return {
    data: nivoData,
    ...(nodeSize ? { nodeSize } : {}),
  };
}

export default function BaseScatterplot({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveScatterPlot {...scatterplotProperties} {...nivoProps} />;
}
