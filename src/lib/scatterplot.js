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
  type ValidationIssue,
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

// Diameter, in pixels
const DEFAULT_SIZE_RANGE = [4, 40];

/**
 * TODO: Scatterplot's validator is validating dataset in addition to config.
 * Probably better to separate those concerns, and possibly even keep
 * dataset validation completely within Scatterplot, as it's not clear yet
 * that other chart types need dataset validation.
 */
function validateConfig(
  data: Dataset,
  config: BaseScatterplotConfig
): ConfigValidation {
  const validation = validateAbstractConfig(data, config);

  const configErrors = [
    ...(Array.isArray(config.y) && config.color
      ? [
          {
            error: new Error(
              'When `color` is specified, `y` must be encoded to a single field.'
            ),
          },
        ]
      : []),
  ];

  const invalidDataWarnings = validateData(data, config);

  return {
    valid: validation.valid && configErrors.length === 0,
    warnings: invalidDataWarnings,
    errors: [...validation.errors, ...configErrors],
  };
}

function validateData(
  data: Dataset,
  config: BaseScatterplotConfig
): $ReadOnlyArray<ValidationIssue> {
  const sizeField = typeof config.size === 'string' ? config.size : null;
  const yKeys = Array.isArray(config.y) ? config.y : [config.y];
  return data
    .filter(
      d =>
        !Number.isFinite(d[config.x]) ||
        yKeys.some(key => !Number.isFinite(d[key])) ||
        (sizeField && !Number.isFinite(d[sizeField])) ||
        (config.color && !d[config.color])
    )
    .map(d => ({
      datum: d,
      error: new Error(
        `Invalid value found at encoded field. Dropping invalid datum: ${JSON.stringify(
          d
        )}`
      ),
    }));
}

function removeInvalidData(data, validation) {
  let mutableInvalidDataMap = new Map(
    validation.warnings
      .filter(warning => warning.datum)
      .map(warning => [warning.datum, true])
  );
  validation.warnings.forEach(warning => console.warn(warning.error));
  return mutableInvalidDataMap.size
    ? data.filter(d => {
        if (mutableInvalidDataMap.get(d)) {
          // once found, remove from invalid data map
          // for faster subsequent checks
          mutableInvalidDataMap.delete(d);
          return false;
        }
        return true;
      })
    : data;
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
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const validData = removeInvalidData(data, validation);

  const size = typeof config.size === 'string' ? config.size : null;
  const nodeSize = size
    ? {
        key: 'size',
        values: extent(validData, d => d[size]),
        sizes: DEFAULT_SIZE_RANGE,
      }
    : config.size;

  let nivoData;
  if (Array.isArray(config.y)) {
    // multi-series
    nivoData = config.y.map(key => ({
      id: key,
      data: validData.map(
        mapToNivoDatum({
          x: config.x,
          y: key,
          size,
        })
      ),
    }));
  } else if (config.color) {
    // color by field
    const grouped = group(validData, d => d[config.color]);
    nivoData = Array.from(grouped.keys(), key => ({
      id: key,
      data: grouped.get(key).map(
        mapToNivoDatum({
          x: config.x,
          y: config.y,
          size,
        })
      ),
    }));
  } else {
    // single-series
    nivoData = [
      {
        id: 'data',
        data: validData.map(
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
