// @flow

//
// Nivo chart props, configured to meet Base Charts design constraints
//

const TOP_MARGIN = 40;
const defaultMargin = {
  // NOTE: Extra margins leave room for legends (top)
  // and axis labels (left, bottom)
  margin: {
    top: TOP_MARGIN,
    right: 20,
    bottom: 50,
    left: 75,
  },
};

const defaultColor = {
  // TODO: create 'baseCharts' scheme? one per primary color?
  // TODO: pull these colors from Base Web theme where relevant
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
  translateY: -TOP_MARGIN,
  symbolSize: 12,
  symbolShape: 'circle',
  justify: false,
  itemsSpacing: 2,
  itemWidth: 80,
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
  ...defaultAxis,
  ...defaultGrid,
  legends: [
    {
      ...defaultLegend,
      dataFrom: 'keys',
    },
  ],
  ...defaultAnimationProps,

  minValue: 'auto',
  maxValue: 'auto',
  colorBy: 'id',
  reverse: false,

  padding: 0.3,
  innerPadding: 0,
  borderRadius: 0,
  borderWidth: 0,

  enableLabel: false,
  isInteractive: true,
};

export const lineProperties = {
  ...defaultMargin,
  ...defaultColor,
  ...defaultAxis,
  ...defaultGrid,
  legends: [defaultLegend],
  ...defaultAnimationProps,

  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
    stacked: false,
    reverse: false,
  },

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
    ...lineProperties.yScale,
    stacked: true,
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
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
  },
  blendMode: 'multiply',
};