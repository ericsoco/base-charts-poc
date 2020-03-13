// @flow
import React from 'react';
import { ResponsiveLine } from '@nivo/line';

import { lineProperties, type Datum } from './chart-props';

type Props = $ReadOnly<{|
  data: $ReadOnlyArray<Datum>,
|}>;

export default function BaseLine({ data }: Props) {
  return (
    <ResponsiveLine
      data={data}
      keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
      indexBy="country"
      {...lineProperties}
    />
  );
}
