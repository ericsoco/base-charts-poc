// @flow
import React, { useMemo } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { group, extent } from 'd3-array';

import { scatterplotProperties } from './chart-props';
import { getXYPropsOverrides } from './chart-props-utils';
import {
  validateEncodings,
  getScatteplotEncodings,
  type ConfigValidation,
  type ValidationIssue,
} from '../validation';
import { keys } from '../utils';
import {
  type Field,
  type Dataset,
  type Datum,
  type ScatterplotConfig,
  type ScatterplotProps as Props,
  type ScatterplotSizeAccessor,
} from '../input-types';

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
type NivoNodeSize = number | NivoNodeSizeConfig | ScatterplotSizeAccessor;
type NivoEncodingProps = $ReadOnly<{|
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
  const yKeys = keys(config.y);
  const sizeField = typeof config.size === 'object' ? config.size.key : null;
  const colorField = typeof config.color === 'object' ? config.color.key : null;
  const invalidData = data.filter(
    d =>
      !Number.isFinite(d[config.x.key]) ||
      yKeys.some(key => !Number.isFinite(d[key])) ||
      (sizeField && !Number.isFinite(d[sizeField])) ||
      (colorField && !d[colorField])
  );
  return invalidData.length > 0
    ? [
        {
          data: invalidData,
          error: new Error(
            'Invalid value found at encoded field. Dropping invalid data:'
          ),
        },
      ]
    : [];
}

function removeInvalidData(data, validation) {
  let mutableInvalidDataMap = new Map(
    validation.warnings.reduce(
      (invalidData, warning) =>
        invalidData.concat((warning.data || []).map(d => [d, true])),
      []
    )
  );
  validation.warnings.forEach(warning =>
    console.warn(warning.error, warning.data)
  );
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
      x: d[x.key],
      y: d[y.key],
      ...(size ? { size: d[size.key] } : {}),
      // flowlint-next-line unclear-type:off
    }: any);
}

/**
 * Convert Base Charts config to Nivo channel encoding props.
 */
export function getEncodingProps(
  data: Dataset,
  config: ScatterplotConfig
): NivoEncodingProps {
  const validation = validateConfig(data, config);
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const validData = removeInvalidData(data, validation);

  const sizeField = typeof config.size === 'object' ? config.size : null;
  const nodeSize: NivoNodeSize = sizeField
    ? {
        key: 'size',
        values: extent(validData, d => d[sizeField.key]),
        sizes: DEFAULT_SIZE_RANGE,
      }
    : // flowlint-next-line unclear-type:off
      ((config.size: any): number | ScatterplotSizeAccessor) || DEFAULT_SIZE;

  const { color } = config;
  const fixedColor = typeof color === 'string' ? color : null;

  let nivoData;
  if (Array.isArray(config.y)) {
    // multi-series
    nivoData = config.y.map(field => ({
      id: field.key,
      data: validData.map(
        mapToNivoDatum({
          x: config.x,
          y: field,
          size: sizeField,
        })
      ),
    }));
  } else if (typeof color === 'object') {
    // color by field
    const grouped = group(validData, d => d[color.key]);
    nivoData = Array.from(grouped.keys(), key => ({
      id: key,
      data: grouped.get(key).map(
        mapToNivoDatum({
          x: config.x,
          // Already switched on y: string[] above
          // flowlint-next-line unclear-type:off
          y: ((config.y: any): Field),
          size: sizeField,
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
            size: sizeField,
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

/**
 * Derive Nivo props from Base Charts config and default Nivo props.
 * Infers static typing from chart type default props.
 */
function getChartProps(config) {
  const overrides = getXYPropsOverrides(config);
  return {
    ...scatterplotProperties,
    ...overrides,
    axisBottom: {
      ...scatterplotProperties.axisBottom,
      ...overrides.axisBottom,
    },
    axisLeft: {
      ...scatterplotProperties.axisLeft,
      ...overrides.axisLeft,
    },
  };
}

export default function BaseScatterplot({ data, config }: Props) {
  const encodingProps = useMemo(() => getEncodingProps(data, config), [
    data,
    config,
  ]);
  const chartProps = useMemo(() => getChartProps(config), [config]);
  return <ResponsiveScatterPlot {...chartProps} {...encodingProps} />;
}
