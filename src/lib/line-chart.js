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

type NivoLineDatum = $ReadOnly<{|
  x: string,
  y: number | null,
|}>;
type NivoLineDataset = $ReadOnly<{|
  id: string,
  data: $ReadOnlyArray<NivoLineDatum>,
|}>;
type NivoProps = $ReadOnly<{|
  data: $ReadOnlyArray<NivoLineDataset>,
|}>;

/**
 * Convert Base Charts config to Nivo props.
 */
export function convertToNivo(
  data: Dataset,
  config: BaseLineConfig
): NivoProps {
  const validation = validateConfig(data, config);
  if (!validation.valid) {
    // TODO: surface errors
    console.error('‼️ Config validation error(s):');
    validation.errors.forEach(e => console.error(e));
  }

  const keys = Array.isArray(config.y) ? config.y : [config.y];
  const nivoData = keys.map(key => ({
    id: key,
    data: data.map(d => ({
      x: d[config.x],
      y: d[key],
    })),
  }));

  return {
    data: nivoData,
  };
}

export default function BaseLine({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveLine {...lineProperties} {...nivoProps} />;
}
