// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { convertToNivo as convertToNivoLine } from './line-chart';
import { areaProperties, type Dataset, type XYConfig } from './chart-props';

type Props = $ReadOnly<{|
  config: BaseAreaConfig,
  data: Dataset,
|}>;

export type BaseAreaConfig = $ReadOnly<{|
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
function convertToNivo(data: Dataset, config: BaseAreaConfig): NivoProps {
  return convertToNivoLine(data, config);
}

export default function BaseArea({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivo(data, config), [data, config]);
  return <ResponsiveLine {...areaProperties} {...nivoProps} />;
}
