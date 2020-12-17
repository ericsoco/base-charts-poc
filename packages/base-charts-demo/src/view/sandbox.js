// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import {
  BaseArea,
  BaseBar,
  BaseLine,
  string,
  number,
  time,
  ThemeProvider,
} from 'base-charts';

// flowlint untyped-import:off
import CategoricalData from '../fixtures/categorical-data.json';
import TimeSeriesData from '../fixtures/time-series-data.json';
// flowlint untyped-import:error

const ChartWrapper: BareStyledComponent = styled.div`
  width: 40rem;
  height: 22.5rem;
  margin: 2rem 2rem 5rem 2rem;
`;
const ChartTitle: BareStyledComponent = styled.h3`
  margin-top: 0;
`;

export default function Sandbox() {
  return (
    <ThemeProvider>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: string('country'),
            y: [
              number('kebab'),
              number('fries'),
              number('hot dog'),
              number('donut'),
            ],
            options: { stack: true, orientation: 'horizontal' },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Line Chart'}</ChartTitle>
        <BaseLine
          data={TimeSeriesData}
          config={{
            x: time('datestr', '%Y-%m-%d'),
            y: [number('japan'), number('norway')],
            options: {
              axis: {
                x: { format: '%b %d' },
              },
            },
          }}
        />
      </ChartWrapper>
    </ThemeProvider>
  );
}
