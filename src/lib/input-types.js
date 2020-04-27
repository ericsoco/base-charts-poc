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
  [Field]: number | string | boolean | null,
}>;
export type Dataset = $ReadOnlyArray<Datum>;

/**
 * Type and helper for field names used in chart configs.
 */
export opaque type Field: string = string;
export function field(field: string): Field {
  return field;
}

/**
 * Type and helper for color strings used in chart configs.
 */
export type Color = $ReadOnly<{| color: string |}>;
export function color(color: string): Color {
  return { color };
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
  size?: number | Field | (Datum => number),
  color?: Field | Color,
  options?: XYOptions,
|}>;
export type ScatterplotProps = $ReadOnly<{|
  config: ScatterplotConfig,
  data: Dataset,
|}>;
