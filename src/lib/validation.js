// @flow
import {
  type BaseChartConfig,
  type BaseChartType,
  type Dataset,
  type Datum,
  type Field,
  type AreaConfig,
  type BarConfig,
  type LineConfig,
  type ScatterplotConfig,
} from './input-types';

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
 * Extract the portion of a config that contains channel encodings.
 * TODO: This config type disambiguation belongs in input-types.
 *   Either move this logic, or consider making each BaseChartType
 *   be member of corresponding BaseChartConfig.
 */
function toEncodingsConfig(
  chartConfig: BaseChartConfig,
  type: BaseChartType
): EncodingsConfig | null {
  switch (type) {
    case 'Area': {
      const config: AreaConfig = (chartConfig: any);
      // eslint-disable-next-line no-unused-vars
      const { options, ...rest } = config;
      return rest;
    }
    case 'Bar': {
      const config: BarConfig = (chartConfig: any);
      // eslint-disable-next-line no-unused-vars
      const { options, stack, ...rest } = config;
      return rest;
    }
    case 'Line': {
      const config: LineConfig = (chartConfig: any);
      // eslint-disable-next-line no-unused-vars
      const { options, ...rest } = config;
      return rest;
    }
    case 'Scatterplot': {
      // Shallow copy to allow mutation below;
      // spread type to make writable
      // TODO: is there a cleaner way to do this?
      let config: { ...ScatterplotConfig } = { ...(chartConfig: any) };
      const hasSizeField = config.size && typeof config.size === 'string';
      const hasColorField =
        config.color && !Object.hasOwnProperty.call(config.color, 'color');

      if (!hasSizeField) delete config.size;
      if (!hasColorField) delete config.color;
      delete config.options;

      return (config: any);
    }
    default:
      return null;
  }
}

/**
 * Validate config against passed data, ensuring all field names
 * encoded in the config are present in the data.
 * TODO: type inference: allow only certain datatypes per config channel
 */
export function validateEncodings(
  data: Dataset,
  chartConfig: BaseChartConfig,
  type: BaseChartType
): ConfigValidation {
  const config = toEncodingsConfig(chartConfig, type);
  if (!config) {
    throw new Error('Passed config does not match passed chart type.');
  }

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
