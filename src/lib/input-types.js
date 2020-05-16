// @flow

// =======================================
// This file contains types/interfaces for
// Base Charts inputs (props), including:
// - data
// - config
// =======================================

/**
 * Row-level datum within a data array
 * passed to a Base Charts chart component.
 */
export type Datum = $ReadOnly<{
  [string]: number | string | boolean | null,
}>;
export type Dataset = $ReadOnlyArray<Datum>;

/**
 * Datatypes supported by Base Charts.
 */
export const DATATYPES = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  TIME: 'TIME',
  BOOL: 'BOOL',
};
export type Datatype = $Keys<typeof DATATYPES>;

/**
 * Fields used in chart configs, and constructors by datatype.
 */
export type Field = $ReadOnly<{|
  key: string,
  type: Datatype,
  format?: string,
|}>;

/**
 * Construct a string column for a chart config.
 */
export function string(key: string): Field {
  return {
    key,
    type: DATATYPES.STRING,
  };
}

/**
 * Construct a number column for a chart config.
 */
export function number(key: string): Field {
  return {
    key,
    type: DATATYPES.NUMBER,
  };
}

/**
 * Construct a time column for a chart config.
 * Requires a d3-time-format.
 */
export function time(key: string, format: string): $NonMaybeType<Field> {
  return {
    key,
    type: DATATYPES.TIME,
    format,
  };
}

/**
 * Construct a boolean column for a chart config.
 */
export function bool(key: string): Field {
  return {
    key,
    type: DATATYPES.BOOL,
  };
}

// Base config type for XY-charts
// Inexact for extensibility.
export type XYConfig = $ReadOnly<{
  x: Field,
  y: Field | $ReadOnlyArray<Field>,
}>;

// Axis display options
type AxisOption = $ReadOnly<{|
  format?: string,
  label?: string,
|}>;

// d3-format strings designate formatting for input
// and output (axis ticks, tooltip, labels)
type FormatOption = $ReadOnly<{|
  x?: string,
  y?: string,
|}>;

// Base options map for XY-charts.
// Inexact for extensibility.
export type XYOptions = $ReadOnly<{
  // Axis formatting and labeling
  axis?: $ReadOnly<{
    x?: AxisOption,
    y?: AxisOption,
  }>,
  // Tooltip and label/annotation formatting
  labels?: $ReadOnly<{|
    format?: FormatOption,
  |}>,
  // Discrete series keys in order of mapping to Base Charts color scale
  seriesColors?: $ReadOnlyArray<string>,
}>;

export type BarConfig = $ReadOnly<{|
  ...$Exact<XYConfig>,
  options?: {
    ...$Exact<XYOptions>,
    stack?: boolean,
    orientation?: 'vertical' | 'horizontal',
  },
|}>;
export type BarProps = $ReadOnly<{|
  config: BarConfig,
  data: Dataset,
|}>;

export type LineConfig = $ReadOnly<{|
  ...$Exact<XYConfig>,
  options?: XYOptions,
|}>;
export type LineProps = $ReadOnly<{|
  config: LineConfig,
  data: Dataset,
|}>;

export type AreaConfig = $ReadOnly<{|
  ...$Exact<XYConfig>,
  options?: XYOptions,
|}>;
export type AreaProps = $ReadOnly<{|
  config: AreaConfig,
  data: Dataset,
|}>;

export type RadialConfig = $ReadOnly<{|
  x: Field,
  y: Field,
  //
  // TODO: What to do about options?
  // Pie/Donut, what else?
  // Center label? (per Base Charts design)
  //
  options?: XYOptions,
|}>;
export type RadialProps = $ReadOnly<{|
  config: RadialConfig,
  data: Dataset,
|}>;

export type ScatterplotSizeAccessor = ({ [string]: mixed }) => number;
/**
 * size:
 * - number: fixed size (px)
 * - Field: linear scale with domain derived from passed field and fixed range
 * - Datum => number: full control
 * color (categorical):
 * - field: field to use for color scale domain
 * - string: fixed hex color
 */
export type ScatterplotConfig = $ReadOnly<{|
  ...$Exact<XYConfig>,
  size?: number | Field | ScatterplotSizeAccessor,
  color?: Field | string,
  options?: XYOptions,
|}>;
export type ScatterplotProps = $ReadOnly<{|
  config: ScatterplotConfig,
  data: Dataset,
|}>;
