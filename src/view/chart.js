// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import { BaseArea, BaseBar, BaseLine } from '../lib';
import BarData from '../fixtures/bar-data.json';
import LineData from '../fixtures/line-data.json';

const ChartWrapper: BareStyledComponent = styled.div`
  width: 40rem;
  height: 22.5rem;
  margin: 2rem;
`;

export default function Chart() {
  return (
    <>
      <ChartWrapper>
        <BaseBar
          data={BarData}
          config={{
            x: 'country',
            y: ['kebab', 'fries'],
            stack: false,
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <BaseLine
          data={LineData}
          config={{
            x: 'datestr',
            y: 'japan',
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <BaseArea
          data={LineData}
          config={{
            x: 'datestr',
            y: ['japan', 'france', 'usa', 'germany', 'norway'],
          }}
        />
      </ChartWrapper>
    </>
  );
}
