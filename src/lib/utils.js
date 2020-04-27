// @flow
import { type Field } from './input-types';

/**
 * Extract keys from a single or array field
 */
export function keys(
  field: Field | $ReadOnlyArray<Field>
): $ReadOnlyArray<string> {
  return Array.isArray(field) ? field.map(({ key }) => key) : [field.key];
}
