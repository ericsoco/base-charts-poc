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

  curve: 'linear',
  lineWidth: 2,
  enableArea: false,

  enablePoints: true,
  pointSize: 10,
  pointColor: { theme: 'background' },
  pointBorderWidth: 2,
  pointBorderColor: { from: 'serieColor' },
  enablePointLabel: false,
  pointLabel: 'y',
  pointLabelYOffset: -12,

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
  blendMode: 'multiply',
};

export const radialProperties = {
  margin: {
    top: TOP_MARGIN,
    right: 80,
    bottom: TOP_MARGIN,
    left: 80,
  },
  ...defaultColor,
  legends: [defaultLegend],
  ...defaultAnimationProps,

  cornerRadius: 0,
  borderWidth: 0,

  enableSlicesLabels: false,

  // TODO: if radial labels are supported in the future, refine these values
  //       & apply greater radial line distance when closer to top/bottom
  //       per https://github.com/plouc/nivo/issues/143#issuecomment-387817599
  enableRadialLabels: false,
  radialLabelsSkipAngle: 10,
  radialLabelsTextXOffset: 6,
  radialLabelsLinkOffset: 0,
  radialLabelsLinkDiagonalLength: 16,
  radialLabelsLinkHorizontalLength: 24,
  radialLabelsLinkStrokeWidth: 1,
};
