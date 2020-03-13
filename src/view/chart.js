// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import { BaseBar, BaseLine } from '../lib';
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
        <BaseBar data={BarData} />
      </ChartWrapper>
      <ChartWrapper>
        <BaseLine data={LineData} />
      </ChartWrapper>
    </>
  );
}
