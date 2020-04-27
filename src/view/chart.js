// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import {
  BaseArea,
  BaseBar,
  BaseLine,
  BaseScatterplot,
  string,
  number,
  time,
} from '../lib';
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
            x: string('country'),
            y: number('kebab'),
            options: { stack: false },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart: Grouped'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: string('country'),
            y: [number('kebab'), number('fries')],
            options: { stack: false },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart: Stacked'}</ChartTitle>
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
            options: { stack: true },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Line Chart'}</ChartTitle>
        <BaseLine
          data={TimeSeriesData}
          config={{
            x: time('datestr', '%Y-%m-%d'),
            y: number('japan'),
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Line Chart: Multi-series'}</ChartTitle>
        <BaseLine
          data={TimeSeriesData}
          config={{
            x: time('datestr', '%Y-%m-%d'),
            y: [number('japan'), number('france')],
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Area Chart'}</ChartTitle>
        <BaseArea
          data={TimeSeriesData}
          config={{
            x: time('datestr', '%Y-%m-%d'),
            y: [
              number('japan'),
              number('france'),
              number('usa'),
              number('germany'),
              number('norway'),
            ],
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Scatterplot w/ fixed size and color'}</ChartTitle>
        <BaseScatterplot
          data={ContinuousData}
          config={{
            x: string('income_per_person_gdppercapita_ppp_inflation_adjusted'),
            y: number('life_expectancy_years'),
            size: 10,
            // TODO: Use Base Web theme for this color (re-export through Base Charts)
            color: '#FF9900',
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bubble Chart'}</ChartTitle>
        <BaseScatterplot
          data={ContinuousData}
          config={{
            x: string('income_per_person_gdppercapita_ppp_inflation_adjusted'),
            y: number('life_expectancy_years'),
            size: string('population_total'),
            color: string('world_4region'),
          }}
        />
      </ChartWrapper>
    </>
  );
}
