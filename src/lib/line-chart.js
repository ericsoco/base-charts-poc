// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import {
  lineProperties,
  validateConfig,
  type Dataset,
  type XYConfig,
} from './chart-props';

type Props = $ReadOnly<{|
  config: BaseLineConfig,
  data: Dataset,
|}>;

export type BaseLineConfig = $ReadOnly<{|
  ...XYConfig,
  // TODO: ?
|}>;

type NivoProps = $ReadOnly<{|
  indexBy: string,
  keys: $ReadOnlyArray<string>,
|}>;

/**
 * Convert Base Charts config to Nivo props.
 */
function convertToNivo(data: Dataset, config: BaseLineConfig): NivoProps {
  const validation = validateConfig(data, config);
  if (!validation.valid) {
    // TODO: surface errors
  }

  return {
    indexBy: config.x,
    keys: Array.isArray(config.y) ? config.y : [config.y],
  };
}

export default function BaseLine({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveLine data={data} {...lineProperties} {...nivoProps} />;
}
