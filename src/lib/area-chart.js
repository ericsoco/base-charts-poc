// @flow
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { convertToNivo as convertToNivoLine } from './line-chart';
import { areaProperties } from './chart-props';
import { type AreaProps as Props } from './input-types';

export default function BaseArea({ data, config }: Props) {
  const nivoProps = useMemo(() => convertToNivoLine(data, config), [
    data,
    config,
  ]);
  return <ResponsiveLine {...areaProperties} {...nivoProps} />;
}
