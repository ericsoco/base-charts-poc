// @flow

//
// Nivo chart props overrides/utils
//

import { DATATYPES, type XYConfig, type XYOptions } from '../input-types';
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

  // Derive label/tooltip formatting
  const xIsTime = config.x.type === DATATYPES.TIME;
  const labelsXFormat = config.options?.labels?.format?.x;
  const labelsYFormat = config.options?.labels?.format?.y;
  const xFormat = labelsXFormat
    ? `${xIsTime ? 'time:' : ''}${labelsXFormat}`
    : null;
  const yFormat = labelsYFormat || null;

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
