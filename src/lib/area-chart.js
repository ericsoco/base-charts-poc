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
  ...$Exact<XYConfig>,
|}>;

export default function BaseArea({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivoLine(data, config), [
    data,
    config,
  ]);
  return <ResponsiveLine {...areaProperties} {...nivoProps} />;
}
