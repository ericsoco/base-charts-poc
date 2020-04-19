// @flow

/**
 * Row-level datum within a data array
 * passed to a Base Charts chart component.
 */
export type Datum = $ReadOnly<{
  [string]: number | string | boolean | null,
}>;
export type Dataset = $ReadOnlyArray<Datum>;

/**
 * Abstract type for the portion of a config
 * that contains channel encodings
 */
export type EncodingsConfig = $ReadOnly<{
  [string]: string | $ReadOnlyArray<string>,
}>;

// Base config type for XY-charts
export type XYConfig = {
  x: string,
  y: string | $ReadOnlyArray<string>,
};

export type ValidationIssue = $ReadOnly<{|
  field?: string,
  datum?: Datum,
  error: Error,
|}>;

export type ConfigValidation = $ReadOnly<{|
  valid: boolean,
  warnings: $ReadOnlyArray<ValidationIssue>,
  errors: $ReadOnlyArray<ValidationIssue>,
|}>;

/**
 * Validate config against passed data, ensuring all field names
 * encoded in the config are present in the data.
 * TODO: type inference: allow only certain datatypes per config channel
 */
export function validateEncodings(
  data: Dataset,
  config: EncodingsConfig
): ConfigValidation {
  const sampleDatum = data[0];
  const allEncodedFields = Object.keys(config).reduce(
    (fields, channel) => fields.concat(config[channel]),
    []
  );

  const errors = allEncodedFields
    .filter(field => !Object.hasOwnProperty.call(sampleDatum, field))
    .map(field => ({
      field,
      error: new Error(`Field '${field}' is missing in passed dataset.`),
    }));

  return {
    valid: errors.length === 0,
    warnings: [],
    errors,
  };
}

const defaultMargin = {
  margin: {
    top: 20,
    right: 20,
    bottom: 50,
    left: 75,
  },
};

const defaultColor = {
  // TODO: create 'baseCharts' scheme?
  // colors: { scheme: 'nivo' },
  colors: [
    // Primary color palette
    '#5b91f4',
    '#3ccece',
    '#ffc043',
    '#e28454',
    '#174291',
    // First five of Secondary color palette
    '#ff5b8c',
    '#abf0ff',
    '#6c78d3',
    '#6a126a',
    '#f7df90',
  ],
};

const defaultAxis = {
  axisBottom: {
    enable: true,
    orient: 'bottom',
    tickSize: 0,
    tickPadding: 10,
    tickRotation: 0,
    tickValues: 5,
    legendOffset: 40,
    legendPosition: 'end',
  },
  axisLeft: {
    enable: true,
    orient: 'left',
    tickSize: 0,
    tickPadding: 10,
    tickRotation: 0,
    tickValues: 5,
    legendOffset: -40,
    legendPosition: 'end',
  },
};

const defaultGrid = {
  enableGridX: false,
  enableGridY: true,
};

const defaultLegend = {
  anchor: 'top-left',
  direction: 'row',
  translateX: 0,
  translateY: -50,
  symbolSize: 12,
  symbolShape: 'circle',
  justify: false,
  itemsSpacing: 2,
  itemWidth: 100,
  itemHeight: 20,
  itemDirection: 'left-to-right',
  itemOpacity: 0.85,
  onClick: (data: { [string]: mixed }) => {
    alert(JSON.stringify(data, null, '    '));
  },
  effects: [
    {
      on: 'hover',
      style: {
        itemOpacity: 1,
      },
    },
  ],
};

const defaultAnimationProps = {
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
};

export const barProperties = {
  ...defaultMargin,
  ...defaultColor,
  ...{
    ...defaultAxis,
    axisBottom: {
      ...defaultAxis.axisBottom,
      // TODO: make this dynamic, based on data
      legend: 'TODO: y-axis label here',
    },
    axisLeft: {
      ...defaultAxis.axisLeft,
      // TODO: make this dynamic, based on data
      legend: 'TODO: x-axis label here',
    },
  },
  ...defaultGrid,
  legends: [
    {
      ...defaultLegend,
      // TODO: make this dynamic, based on data
      dataFrom: 'keys',
    },
  ],
  ...defaultAnimationProps,

  padding: 0.3,
  innerPadding: 0,
  minValue: 'auto',
  maxValue: 'auto',

  groupMode: 'stacked',
  layout: 'vertical',
  reverse: false,

  colorBy: 'id',
  borderRadius: 0,
  borderWidth: 0,
  borderColor: {
    from: 'color',
    modifiers: [['darker', 1.6]],
  },

  enableLabel: true,
  labelSkipWidth: 12,
  labelSkipHeight: 12,
  labelTextColor: {
    from: 'color',
    modifiers: [['darker', 1.6]],
  },

  isInteractive: true,
  'custom tooltip example': false,
  tooltip: null,
};

export const lineProperties = {
  ...defaultMargin,
  ...defaultColor,
  ...{
    ...defaultAxis,
    axisBottom: {
      ...defaultAxis.axisBottom,
      format: '%b %d',
      // TODO: make this dynamic, based on data
      legend: 'TODO: y-axis label here',
    },
    axisLeft: {
      ...defaultAxis.axisLeft,
      // TODO: make this dynamic, based on data
      legend: 'TODO: x-axis label here',
    },
  },
  ...defaultGrid,
  legends: [defaultLegend],
  ...defaultAnimationProps,

  xScale: {
    // TODO: derive scale types from passed data
    // type: 'point',
    type: 'time',
    // TODO: derive formatting from passed data
    format: '%Y-%m-%d',
    precision: 'day',
  },
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
    stacked: false,
    reverse: false,
  },
  // TODO: derive formatting from passed data
  xFormat: 'time:%Y-%m-%d',

  curve: 'linear',

  lineWidth: 2,

  enablePoints: true,
  pointSize: 10,
  pointColor: { theme: 'background' },
  pointBorderWidth: 2,
  pointBorderColor: { from: 'serieColor' },
  enablePointLabel: false,
  pointLabel: 'y',
  pointLabelYOffset: -12,

  enableArea: false,

  isInteractive: true,
  enableSlices: 'x',
  debugSlices: false,

  enableCrosshair: true,
  crosshairType: 'bottom-left',

  useMesh: false,
  debugMesh: false,
};

export const areaProperties = {
  ...lineProperties,
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
    stacked: true,
    reverse: false,
  },

  enablePoints: false,
  enableArea: true,
  areaBlendMode: 'normal',
  areaBaselineValue: 0,
  areaOpacity: 1.0,
};

export const scatterplotProperties = {
  ...defaultMargin,
  ...defaultColor,
  ...defaultAxis,
  ...defaultGrid,
  legends: [defaultLegend],
  ...defaultAnimationProps,
  xScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
  },
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
  },
  blendMode: 'multiply',
  // TODO: refine this
};
