// @flow
import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { barProperties, type Datum } from './chart-props';

type Dataset = $ReadOnlyArray<Datum>;
type Props = $ReadOnly<{|
  config: BaseBarConfig,
  data: Dataset,
|}>;

export type BaseBarConfig = $ReadOnly<{|
  x: string,
  y: string | $ReadOnlyArray<string>,
  groupBy?: string | $ReadOnlyArray<string>,
  orderBy?: string | $ReadOnlyArray<string>,
  stack?: boolean,
|}>;

type NivoProps = $ReadOnly<{|
  indexBy: string,
  keys: $ReadOnlyArray<string>,
  groupMode: 'grouped' | 'stacked',
|}>;

type ValidationError = $ReadOnly<{|
  field: string,
  error: Error,
|}>;

type ConfigValidation = $ReadOnly<{|
  valid: boolean,
  errors: $ReadOnlyArray<ValidationError>,
|}>;

/**
 * Validate config against passed data, ensuring all field names
 * in config are present in the data.
 * TODO: implement
 * TODO: type inference: allow only certain datatypes per config channel
 */
function validateConfig(): ConfigValidation {
// data: Dataset,
// config: BaseBarConfig
  return {
    valid: true,
    errors: [],
  };
}

/**
 * Convert Base Charts config to Nivo props.
 */
function convertToNivo(data: Dataset, config: BaseBarConfig): NivoProps {
  const validation = validateConfig(data, config);
  if (!validation.valid) {
    // TODO: surface errors
  }

  return {
    // keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
    indexBy: config.x,
    keys: Array.isArray(config.y) ? config.y : [config.y],
    groupMode: config.stack ? 'stacked' : 'grouped',
  };
}

export default function BaseBar({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveBar data={data} {...barProperties} {...nivoProps} />;
}
