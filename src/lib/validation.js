// @flow
import {
  type Dataset,
  type Datum,
  type Field,
  type AreaConfig,
  type BarConfig,
  type LineConfig,
  type ScatterplotConfig,
} from './input-types';
import { keys } from './utils';

export type ValidationIssue = $ReadOnly<{|
  field?: string,
  datum?: Datum,
  error: Error,
|}>;

export type ConfigValidation = $ReadOnly<{|
  valid: boolean,
  warnings: $ReadOnlyArray<ValidationIssue>,
  errors: $ReadOnlyArray<ValidationIssue>,
|}>;

type EncodingsConfig = $ReadOnly<{
  [string]: Field | $ReadOnlyArray<Field>,
}>;

/**
 * Extract the portion of a XY config that contains channel encodings.
 */
export function getXYEncodings(
  chartConfig: AreaConfig | BarConfig | LineConfig
): EncodingsConfig {
  // eslint-disable-next-line no-unused-vars
  const { options, ...rest } = chartConfig;
  return (rest: any);
}

/**
 * Extract the portion of a Scatterplot config that contains channel encodings.
 */
export function getScatteplotEncodings(
  chartConfig: ScatterplotConfig
): EncodingsConfig {
  // Shallow copy to allow mutation; spread type to make properties writable
  let config: { ...ScatterplotConfig } = { ...(chartConfig: any) };
  const hasSizeField = config.size && typeof config.size === 'string';
  const hasColorField =
    config.color && !Object.hasOwnProperty.call(config.color, 'color');

  // prune config entries that are not channel encodings
  if (!hasSizeField) delete config.size;
  if (!hasColorField) delete config.color;
  delete config.options;

  return (config: any);
}

/**
 * Validate config against passed data, ensuring all field names
 * encoded in the config are present in the data.
 * TODO: allow only certain datatypes per config channel
 */
export function validateEncodings(
  data: Dataset,
  config: EncodingsConfig
): ConfigValidation {
  const sampleDatum = data[0];
  const allEncodedKeys = Object.keys(config).reduce(
    (fields, channel) =>
      fields.concat(
        Array.isArray(config[channel])
          ? keys(config[channel])
          : [config[channel].key]
      ),
    []
  );

  const errors = allEncodedKeys
    .filter(key => !Object.hasOwnProperty.call(sampleDatum, key))
    .map(key => ({
      field: key,
      error: new Error(`Field '${key}' is missing in passed dataset.`),
    }));

  return {
    valid: errors.length === 0,
    warnings: [],
    errors,
  };
}
