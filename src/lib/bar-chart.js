// @flow
import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import {
  barProperties,
  validateConfig,
  type Dataset,
  type XYConfig,
} from './chart-props';

type Props = $ReadOnly<{|
  config: BaseBarConfig,
  data: Dataset,
|}>;

export type BaseBarConfig = $ReadOnly<{|
  ...XYConfig,
  stack?: boolean,
|}>;

type NivoProps = $ReadOnly<{|
  indexBy: string,
  keys: $ReadOnlyArray<string>,
  groupMode: 'grouped' | 'stacked',
|}>;

/**
 * Convert Base Charts config to Nivo props.
 */
function convertToNivo(data: Dataset, config: BaseBarConfig): NivoProps {
  const validation = validateConfig(data, config);
  if (!validation.valid) {
    // TODO: surface errors
  }

  return {
    indexBy: config.x,
    keys: Array.isArray(config.y) ? config.y : [config.y],
    groupMode: config.stack ? 'stacked' : 'grouped',
  };
}

export default function BaseBar({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveBar data={data} {...barProperties} {...nivoProps} />;
}
