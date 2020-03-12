// @flow

/**
 * Inject Base Charts per-chart styles/settings
 * NOTE: Applicable and pre-defined properties vary by chart type
 */
export function applyBaseChartsStyles(properties) {
  return {
    ...properties,
    margin: {
      ...properties.margin,
      top: 100,
    },
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

    // Disable SVG pattern fills
    ...{
      defs: [],
      fill: [],
    },

    enableGridX: false,

    // Axes
    axisBottom: {
      ...properties.axisBottom,
      legend: '',
      tickPadding: 10,
      tickSize: 0,
    },
    axisLeft: {
      ...properties.axisLeft,
      legend: '',
      tickPadding: 10,
      tickValues: 5,
    },

    // Legends
    ...(properties.legends && properties.legends[0]
      ? {
          legends: [
            {
              ...properties.legends[0],
              anchor: 'top-left',
              direction: 'row',
              translateX: 0,
              translateY: -50,
              symbolSize: 12,
              symbolShape: 'circle',
            },
          ],
        }
      : {}),
  };
}

export const barProperties = {
  margin: {
    top: 50,
    right: 130,
    bottom: 50,
    left: 60,
  },

  padding: 0.3,
  innerPadding: 0,
  minValue: 'auto',
  maxValue: 'auto',

  groupMode: 'stacked',
  layout: 'vertical',
  reverse: false,

  colors: { scheme: 'nivo' },
  colorBy: 'id',
  borderRadius: 0,
  borderWidth: 0,
  borderColor: {
    from: 'color',
    modifiers: [['darker', 1.6]],
  },

  axisTop: {
    enable: false,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: '',
    legendOffset: 36,
  },
  axisRight: {
    enable: false,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: '',
    legendOffset: 0,
  },
  axisBottom: {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'country',
    legendPosition: 'middle',
    legendOffset: 32,
  },
  axisLeft: {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'food',
    legendPosition: 'middle',
    legendOffset: -40,
  },

  enableGridX: false,
  enableGridY: true,

  enableLabel: true,
  labelSkipWidth: 12,
  labelSkipHeight: 12,
  labelTextColor: {
    from: 'color',
    modifiers: [['darker', 1.6]],
  },

  legends: [
    {
      dataFrom: 'keys',
      anchor: 'bottom-right',
      direction: 'column',
      justify: false,
      translateX: 120,
      translateY: 0,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: 'left-to-right',
      itemOpacity: 0.85,
      symbolSize: 20,
      onClick: data => {
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
    },
  ],

  isInteractive: true,
  'custom tooltip example': false,
  tooltip: null,

  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
};
