// @flow

//
// Nivo chart props overrides/utils
//
import React, { type Node } from 'react';
import {
  DATATYPES,
  type Datum,
  type DatumValue,
  type XYConfig,
  type XYOptions,
} from '../input-types';
import { type Theme } from '../theme';
import Tooltip from '../tooltip';
import { keys } from '../utils';

export const datatypeToScaleType = {
  [DATATYPES.STRING]: 'point',
  [DATATYPES.NUMBER]: 'linear',
  [DATATYPES.TIME]: 'time',
  [DATATYPES.BOOL]: 'point',
};

type XYConfigWithOptions = $ReadOnly<{
  ...XYConfig,
  options?: XYOptions,
}>;

type AxisOverrides = $ReadOnly<{|
  format?: string,
  legend: string,
|}>;

type ScalePoint = $ReadOnly<{|
  type: 'point',
|}>;
type ScaleLinear = $ReadOnly<{|
  type: 'linear',
  min: 'auto' | number,
  max: 'auto' | number,
|}>;
type ScaleTime = $ReadOnly<{|
  // TODO: enumerate these in chart-props and use in datatypeToScaleType
  type: 'time',
  format?: string,
  // TODO: enumerate available values from Nivo
  precision?: string,
|}>;
type Scale = ScalePoint | ScaleLinear | ScaleTime;

type XYPropsOverrides = $ReadOnly<{|
  axisBottom: AxisOverrides,
  axisLeft: AxisOverrides,
  xScale: Scale,
  yScale: Scale,
  xFormat?: string,
  yFormat?: string,
  sliceTooltip?: ({ slice: NivoSlice }) => Node,
|}>;

/**
 * Given a chart config, derive props overrides for XY charts,
 * to spread over per-chart props.
 */
export function getXYPropsOverrides(
  config: XYConfigWithOptions
): XYPropsOverrides {
  // Derive axis label formatting
  const axis = config.options?.axis;

  const axisXFormat = axis?.x?.format || config.x.format;
  const axisBottom: AxisOverrides = ({
    ...(axisXFormat ? { format: axisXFormat } : {}),
    legend: axis?.x?.label || config.x.key,
    // Flow can't handle spreads into Exact types
    // flowlint-next-line unclear-type:off
  }: any);

  const axisYFormat = axis?.y?.format;
  const axisLeft = ({
    ...(axisYFormat !== null ? { format: axisYFormat } : {}),
    legend: axis?.y?.label || keys(config.y).join(','),
    // Flow can't handle spreads into Exact types
    // flowlint-next-line unclear-type:off
  }: any);

  const xFormat = deriveFormat(config, 'x');
  const yFormat = deriveFormat(config, 'y');

  // Sometimes Flow makes my eyes bleed
  // https://github.com/facebook/flow/issues/8186
  const xf: $ReadOnly<{|
    xFormat?: string,
  |}> = xFormat ? { xFormat } : { ...null };
  const yf: $ReadOnly<{|
    yFormat?: string,
  |}> = yFormat ? { yFormat } : { ...null };

  return {
    axisBottom,
    axisLeft,
    xScale: deriveScale(config, 'x'),
    yScale: deriveScale(config, 'y'),
    ...xf,
    ...yf,
  };
}

/**
 * Derive label/tooltip formatting for a channel, w/ the following precedence:
 * - label format if exists, else
 * - axis format if exists, else
 * - field format if exists, else
 * - null.
 */
function deriveFormat(
  config: XYConfigWithOptions,
  channel: string
): string | null {
  const isTime = config[channel].type === DATATYPES.TIME;
  const labelsFormat = config.options?.labels?.format?.[channel];
  const axisFormat = config.options?.axis?.[channel]?.format;
  const formatBase =
    labelsFormat || axisFormat || config[channel].format || null;
  return formatBase ? `${isTime ? 'time:' : ''}${formatBase}` : null;
}

/**
 * Derive scale for specified channel
 */
function deriveScale(config: XYConfigWithOptions, channel: string): Scale {
  const scaleType = datatypeToScaleType[config[channel].type];
  return scaleType === 'time'
    ? config.x.format
      ? {
          type: 'time',
          // Specify input format for dates
          format: config.x.format,
          // TODO: how to / should we expose this in Base Charts API?
          precision: 'day',
        }
      : { type: 'time' }
    : scaleType === 'point'
    ? { type: 'point' }
    : {
        type: 'linear',
        min: 'auto',
        max: 'auto',
      };
}

type NivoPoint = $ReadOnly<{|
  color: string,
  data: Datum,
  id: string,
  index: number,
  indexValue: string,
  theme: Theme,
  value: DatumValue,
|}>;

type NivoSlicePoint = $ReadOnly<{|
  id: string,
  index: number,
  serieId: string,
  serieColor: string,
  x: number | null,
  y: number | null,
  color: string,
  borderColor: string,
  data: {
    x: DatumValue,
    y: DatumValue,
    xFormatted: string,
    yFormatted: string,
  },
|}>;
type NivoSlice = $ReadOnly<{|
  id: string,
  x0: number,
  x: number,
  y0: number,
  y: number,
  width: number,
  height: number,
  points: $ReadOnlyArray<NivoSlicePoint>,
|}>;

type PointTooltipProps = $ReadOnly<{|
  tooltip: NivoPoint => Node,
  theme: { [string]: mixed },
|}>;

/**
 * Generator for a tooltip displaying a single { key: value } pair.
 * Used by e.g. Bar, Radial, Scatterplot.
 * TODO: Is formatting applied to the `point` prop already, or not at all?
 */
export function getPointTooltipProps(): PointTooltipProps {
  function PointTooltip(point: NivoPoint) {
    return (
      <Tooltip
        rows={[
          {
            datum: {
              key: point.indexValue,
              value: point.value,
            },
            legend: {
              color: point.color,
              // TODO: Nivo doesn't appear to support / expose these values
              style: 'solid',
              width: '1px',
            },
          },
        ]}
      />
    );
  }

  return {
    tooltip: PointTooltip,
    theme: {
      tooltip: {
        container: {
          background: 'rgba(0,0,0,0)',
          borderRadius: 0,
          boxShadow: 'none',
          padding: 0,
        },
      },
    },
  };
}

type SliceTooltipProps = $ReadOnly<{|
  sliceTooltip: ({ slice: NivoSlice }) => Node,
|}>;
/**
 * Generator for a tooltip derived from a Nivo "slice". Displays the slice
 * x value as title and one row for each { key: value } pair in the slice.
 * Used by e.g. Area & Line charts.
 */
export function getSliceTooltipProps(
  config: XYConfigWithOptions
): SliceTooltipProps {
  const xKey = config.x.key;
  function SliceTooltip({ slice }: { slice: NivoSlice }) {
    const { points } = slice;
    if (points.length === 0) return null;

    const titleRow = {
      datum: {
        key: xKey,
        value: points[0].data.xFormatted,
      },
    };
    const rows = slice.points.map(point => ({
      datum: {
        key: point.serieId,
        value: point.data.yFormatted,
      },
      legend: {
        color: point.serieColor,
        // TODO: Nivo doesn't appear to support / expose these values
        style: 'solid',
        width: '1px',
      },
    }));
    return <Tooltip titleRow={titleRow} rows={rows} />;
  }
  return { sliceTooltip: SliceTooltip };
}
