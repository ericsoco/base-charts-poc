// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import { BaseArea, BaseBar, BaseLine, BaseScatterplot } from '../lib';
import CategoricalData from '../fixtures/categorical-data.json';
import ContinuousData from '../fixtures/continuous-data.json';
import TimeSeriesData from '../fixtures/time-series-data.json';

const ChartWrapper: BareStyledComponent = styled.div`
  width: 40rem;
  height: 22.5rem;
  margin: 2rem 2rem 5rem 2rem;
`;
const ChartTitle: BareStyledComponent = styled.h3`
  margin-top: 0;
`;

export default function Chart() {
  return (
    <>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: 'country',
            y: 'kebab',
            stack: false,
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart: Grouped'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: 'country',
            y: ['kebab', 'fries'],
            stack: false,
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart: Stacked'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: 'country',
            y: ['kebab', 'fries', 'hot dog', 'donut'],
            stack: true,
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Line Chart'}</ChartTitle>
        <BaseLine
          data={TimeSeriesData}
          config={{
            x: 'datestr',
            y: 'japan',
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Line Chart: Multi-series'}</ChartTitle>
        <BaseLine
          data={TimeSeriesData}
          config={{
            x: 'datestr',
            y: ['japan', 'france'],
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Area Chart'}</ChartTitle>
        <BaseArea
          data={TimeSeriesData}
          config={{
            x: 'datestr',
            y: ['japan', 'france', 'usa', 'germany', 'norway'],
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Scatterplot'}</ChartTitle>
        <BaseScatterplot
          data={ContinuousData}
          config={{
            x: 'income_per_person_gdppercapita_ppp_inflation_adjusted',
            y: 'life_expectancy_years',
            size: 10,
          }}
        />
      </ChartWrapper>
      {/*
      <ChartWrapper>
        <ChartTitle>{'Bubble Chart'}</ChartTitle>
        <BaseScatterplot
          data={ContinuousData}
          config={{
            x: 'income_per_person_gdppercapita_ppp_inflation_adjusted',
            y: 'life_expectancy_years',
            size: 'population_total',
            color: 'world_4region',
          }}
        />
      </ChartWrapper>
    */}
    </>
  );
}
