// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import { ResponsiveBar } from '@nivo/bar';

import { applyBaseChartsStyles, barProperties } from './chart-props';

const ChartWrapper: BareStyledComponent = styled.div`
  width: 80rem;
  height: 45rem;
`;

type Datum = $ReadOnly<{|
  [string]: string | boolean | Date | null,
|}>;
type Props = $ReadOnly<{|
  data: $ReadOnlyArray<Datum>,
|}>;

export default function BaseBar({ data }: Props) {
  return (
    <ChartWrapper>
      <ResponsiveBar
        data={data}
        keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
        indexBy="country"
        {...applyBaseChartsStyles(barProperties)}
      />
    </ChartWrapper>
  );
}
