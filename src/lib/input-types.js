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
export function string(key: string): Field {
  return {
    key,
    type: DATATYPES.STRING,
  };
}
export function number(key: string): Field {
  return {
    key,
    type: DATATYPES.NUMBER,
  };
}
export function time(key: string, format: string): Field {
  return {
    key,
    type: DATATYPES.TIME,
    format,
  };
}
export function bool(key: string): Field {
  return {
    key,
    type: DATATYPES.BOOL,
  };
}

// Base config type for XY-charts
export type XYConfig = $ReadOnly<{
  x: Field,
  y: Field | $ReadOnlyArray<Field>,
}>;

// d3-format strings to specify input/output formatting
type FormatOption = $ReadOnly<{|
  // Format of values within source dataset
  input: string,
  // Format used to render values within axis ticks and tooltip
  output: string,
|}>;

// Axis display options
type AxisOption = $ReadOnly<{|
  label: string,
|}>;

// Base options map for XY-charts
export type XYOptions = $ReadOnly<{|
  format?: $ReadOnly<{
    x?: FormatOption,
    y?: FormatOption,
  }>,
  axis?: $ReadOnly<{
    x?: AxisOption,
    y?: AxisOption,
  }>,
  // Discrete series keys in order of mapping to Base Charts color scale
  seriesColors?: $ReadOnlyArray<string>,
|}>;

export type BarConfig = $ReadOnly<{|
  ...$Exact<XYConfig>,
  options?: {
    ...$Exact<XYOptions>,
    stack?: boolean,
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
