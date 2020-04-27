// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import {
  BaseArea,
  BaseBar,
  BaseLine,
  BaseScatterplot,
  field,
  color,
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
            x: field('country'),
            y: field('kebab'),
            options: { stack: false },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart: Grouped'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: field('country'),
            y: [field('kebab'), field('fries')],
            options: { stack: false },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bar Chart: Stacked'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: field('country'),
            y: [
              field('kebab'),
              field('fries'),
              field('hot dog'),
              field('donut'),
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
            x: field('datestr'),
            y: field('japan'),
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Line Chart: Multi-series'}</ChartTitle>
        <BaseLine
          data={TimeSeriesData}
          config={{
            x: field('datestr'),
            y: [field('japan'), field('france')],
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Area Chart'}</ChartTitle>
        <BaseArea
          data={TimeSeriesData}
          config={{
            x: field('datestr'),
            y: [
              field('japan'),
              field('france'),
              field('usa'),
              field('germany'),
              field('norway'),
            ],
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Scatterplot w/ fixed size and color'}</ChartTitle>
        <BaseScatterplot
          data={ContinuousData}
          config={{
            x: field('income_per_person_gdppercapita_ppp_inflation_adjusted'),
            y: field('life_expectancy_years'),
            size: 10,
            // TODO: Use Base Web theme for this color (re-export through Base Charts)
            color: color('#FF9900'),
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Bubble Chart'}</ChartTitle>
        <BaseScatterplot
          data={ContinuousData}
          config={{
            x: field('income_per_person_gdppercapita_ppp_inflation_adjusted'),
            y: field('life_expectancy_years'),
            size: field('population_total'),
            color: field('world_4region'),
          }}
        />
      </ChartWrapper>
    </>
  );
}
