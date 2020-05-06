// @flow

//
// Nivo chart props overrides/utils
//

import { DATATYPES, type XYConfig, type XYOptions } from './input-types';
import { keys } from './utils';

export const datatypeToScaleType = {
  [DATATYPES.STRING]: 'point',
  [DATATYPES.NUMBER]: 'linear',
  [DATATYPES.TIME]: 'time',
  [DATATYPES.BOOL]: 'point',
};

type XYConfigWithOptions = $ReadOnly<{|
  ...$Exact<XYConfig>,
  options?: XYOptions,
|}>;

type AxisOverrides = $ReadOnly<{|
  format?: string,
  legend: string,
|}>;

type XScalePoint = $ReadOnly<{|
  type: 'point',
|}>;
type XScaleLinear = $ReadOnly<{|
  type: 'linear',
|}>;
type XScaleTime = $ReadOnly<{|
  // TODO: enumerate these in chart-props and use in datatypeToScaleType
  type: 'time',
  format?: string,
  // TODO: enumerate available values from Nivo
  precision?: string,
|}>;
type XScale = XScalePoint | XScaleLinear | XScaleTime;

type XYPropsOverrides = $ReadOnly<{|
  axisBottom: AxisOverrides,
  axisLeft: AxisOverrides,
  xScale: XScale,
  xFormat?: string,
  yFormat?: string,
|}>;

/**
 * Get props overrides for XY charts, to spread over per-chart props.
 */
export function getXYPropsOverrides(
  config: XYConfigWithOptions
): XYPropsOverrides {
  // Derive input formatting
  const xScaleType = datatypeToScaleType[config.x.type];
  const xScale =
    xScaleType === 'time'
      ? {
          type: 'time',
          ...(config.x.format
            ? {
                format: config.x.format,
                // TODO: how to / should we expose this in Base Charts API?
                precision: 'day',
              }
            : {}),
        }
      : xScaleType === 'point'
      ? { type: 'point' }
      : { type: 'linear' };

  // TODO: add yScale derivation and remove hardcoded yScales in input-types

  // Derive axis label formatting
  const axis = config.options?.axis;

  const axisXFormat = axis?.x?.format || config.x.format;
  const axisBottom = {
    ...(axisXFormat ? { format: axisXFormat } : {}),
    legend: axis?.x?.label || config.x.key,
  };

  const axisYFormat = axis?.y?.format;
  const axisLeft = {
    ...(axisYFormat !== null ? { format: axisYFormat } : {}),
    legend: axis?.y?.label || keys(config.y).join(','),
  };

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
    xScale,
    ...xf,
    ...yf,
  };
}
