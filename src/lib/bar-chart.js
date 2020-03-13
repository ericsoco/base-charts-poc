// @flow
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { barProperties, type Datum } from './chart-props';

type Props = $ReadOnly<{|
  data: $ReadOnlyArray<Datum>,
|}>;

export default function BaseBar({ data }: Props) {
  return (
    <ResponsiveBar
      data={data}
      keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
      indexBy="country"
      {...barProperties}
    />
  );
}
