// @flow
import React, { useMemo } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { group, extent } from 'd3-array';

import { scatterplotProperties } from './chart-props';
import {
  validateEncodings,
  getScatteplotEncodings,
  type ConfigValidation,
  type ValidationIssue,
} from './validation';
import {
  type Field,
  type Dataset,
  type Datum,
  type ScatterplotConfig,
  type ScatterplotProps as Props,
} from './input-types';

type NivoScatterplotDatum = $ReadOnly<{|
  x: number | string | Date,
  y: number | string | Date,
  size?: number,
|}>;
type NivoScatterplotDataset = $ReadOnly<{|
  id: string,
  data: $ReadOnlyArray<NivoScatterplotDatum>,
|}>;
type NivoNodeSizeConfig = $ReadOnly<{|
  key: string,
  values: [number, number],
  sizes: [number, number],
|}>;
type NivoNodeSize =
  | number
  | (NivoScatterplotDatum => number)
  | NivoNodeSizeConfig;
type NivoProps = $ReadOnly<{|
  data: $ReadOnlyArray<NivoScatterplotDataset>,
  nodeSize: NivoNodeSize,
  colors?: $ReadOnlyArray<string>,
|}>;

// Scatterplot mark sizes, in pixels
const DEFAULT_SIZE = 4;
const DEFAULT_SIZE_RANGE = [4, 40];

/**
 * TODO: Scatterplot's validator is validating dataset in addition to config.
 * Probably better to separate those concerns, and possibly even keep
 * dataset validation completely within Scatterplot, as it's not clear yet
 * that other chart types need dataset validation.
 */
function validateConfig(
  data: Dataset,
  config: ScatterplotConfig
): ConfigValidation {
  const validation = validateEncodings(data, getScatteplotEncodings(config));

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
  config: ScatterplotConfig
): $ReadOnlyArray<ValidationIssue> {
  const sizeField = typeof config.size === 'string' ? config.size : null;
  const yKeys = Array.isArray(config.y) ? config.y : [config.y];
  const colorField: Field | null =
    config.color && !config.color.color ? (config.color: any) : null;
  return data
    .filter(
      d =>
        !Number.isFinite(d[config.x]) ||
        yKeys.some(key => !Number.isFinite(d[key])) ||
        (sizeField && !Number.isFinite(d[sizeField])) ||
        (colorField && !d[colorField])
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

function mapToNivoDatum({
  x,
  y,
  size,
}: $ReadOnly<{|
  x: Field,
  y: Field,
  size: ?Field,
|}>): Datum => NivoScatterplotDatum {
  // TODO: Validate datatypes in validation step and remove typecast
  return d =>
    ({
      x: d[x],
      y: d[y],
      ...(size ? { size: d[size] } : {}),
    }: any);
}

function getFixedColor(config: ScatterplotConfig): string | null {
  if (config.color) {
    if (config.color.color) return (config.color: any).color;
  }
  return null;
}

/**
 * Convert Base Charts config to Nivo props.
 */
export function convertToNivo(
  data: Dataset,
  config: ScatterplotConfig
): NivoProps {
  const validation = validateConfig(data, config);
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const validData = removeInvalidData(data, validation);

  const size = typeof config.size === 'string' ? config.size : null;
  const nodeSize: NivoNodeSize = size
    ? {
        key: 'size',
        values: extent(validData, d => d[size]),
        sizes: DEFAULT_SIZE_RANGE,
      }
    : // Already switched on size: string above
      ((config.size: any): number) || DEFAULT_SIZE;

  const fixedColor = getFixedColor(config);

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
  } else if (config.color && fixedColor === null) {
    // color by field
    const grouped = group(validData, d => d[config.color]);
    nivoData = Array.from(grouped.keys(), key => ({
      id: key,
      data: grouped.get(key).map(
        mapToNivoDatum({
          x: config.x,
          // Already switched on y: string[] above
          y: ((config.y: any): Field),
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

  const props = {
    data: nivoData,
    nodeSize,
  };
  return fixedColor ? { ...props, colors: [fixedColor] } : props;
}

export default function BaseScatterplot({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveScatterPlot {...scatterplotProperties} {...nivoProps} />;
}
