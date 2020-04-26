// @flow
import { type Dataset, type Datum, type Field } from './input-types';

/**
 * Abstract type for the portion of a config
 * that contains channel encodings
 */
export type EncodingsConfig = $ReadOnly<{
  [string]: Field | $ReadOnlyArray<Field>,
}>;

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

/**
 * Validate config against passed data, ensuring all field names
 * encoded in the config are present in the data.
 * TODO: type inference: allow only certain datatypes per config channel
 */
export function validateEncodings(
  data: Dataset,
  config: EncodingsConfig
): ConfigValidation {
  const sampleDatum = data[0];
  const allEncodedFields = Object.keys(config).reduce(
    (fields, channel) => fields.concat(config[channel]),
    []
  );

  const errors = allEncodedFields
    .filter(field => !Object.hasOwnProperty.call(sampleDatum, field))
    .map(field => ({
      field,
      error: new Error(`Field '${field}' is missing in passed dataset.`),
    }));

  return {
    valid: errors.length === 0,
    warnings: [],
    errors,
  };
}
