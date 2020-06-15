// @flow
import React from 'react';
import styled, { type BareStyledComponent } from 'styled-components';
import {
  BaseArea,
  BaseBar,
  BaseLine,
  BaseRadial,
  BaseScatterplot,
  string,
  number,
  time,
  ThemeProvider,
} from 'base-charts';

// flowlint untyped-import:off
import CategoricalData from '../fixtures/categorical-data.json';
import ContinuousData from '../fixtures/continuous-data.json';
import TimeSeriesData from '../fixtures/time-series-data.json';
import DataCentralData from '../fixtures/data-central.json';
// flowlint untyped-import:error

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
    <ThemeProvider>
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
        <ChartTitle>{'Bar Chart: Horizontal'}</ChartTitle>
        <BaseBar
          data={CategoricalData}
          config={{
            x: string('country'),
            y: number('kebab'),
            options: { stack: false, orientation: 'horizontal' },
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
        <ChartTitle>
          {'Line Chart: Multi-series, w/ custom formatting'}
        </ChartTitle>
        <BaseLine
          data={TimeSeriesData}
          config={{
            x: time('datestr', '%Y-%m-%d'),
            y: [number('japan'), number('france')],
            options: {
              axis: {
                x: { format: '%b %d' },
                y: { format: '~r' },
              },
              labels: {
                format: {
                  x: '%A, %B %e',
                  y: '.1f',
                },
              },
            },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Data Central'}</ChartTitle>
        <BaseLine
          data={DataCentralData}
          config={{
            x: time('x', '%Y-%m-%d'),
            y: number('Prereplicated size (producer)'),
            options: {
              axis: {
                x: { format: '%b %d' },
                y: { format: '~s' },
              },
              labels: {
                format: {
                  x: '%b %d',
                  y: '~s',
                },
              },
            },
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
        <ChartTitle>{'Donut Chart'}</ChartTitle>
        <BaseRadial
          data={CategoricalData}
          // TODO: what to name channels? Could even stick with x/y...
          config={{
            key: string('country'),
            value: number('kebab'),
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Pie Chart'}</ChartTitle>
        <BaseRadial
          data={CategoricalData}
          // TODO: what to name channels? Could even stick with x/y...
          config={{
            key: string('country'),
            value: number('kebab'),
            options: {
              layout: 'pie',
            },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>{'Scatterplot w/ fixed size and color'}</ChartTitle>
        <BaseScatterplot
          data={ContinuousData}
          config={{
            x: number('income_per_person_gdppercapita_ppp_inflation_adjusted'),
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
            x: number('income_per_person_gdppercapita_ppp_inflation_adjusted'),
            y: number('life_expectancy_years'),
            size: string('population_total'),
            color: string('world_4region'),
          }}
        />
      </ChartWrapper>
    </ThemeProvider>
  );
}
