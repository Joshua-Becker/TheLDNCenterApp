import React from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';
import {
    LineChart,
    ProgressChart
  } from "react-native-chart-kit";

const { width, height } = Dimensions.get('screen');

export default function Graph({ graphTitle, graphData, graphLabels, ...rest }) {
    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0.5,
        backgroundGradientTo: "#ccc",
        backgroundGradientToOpacity: .8,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
        decimalPlaces: 0,
        propsForLabels:{fontSize: 22,},
    };

    let data = {
        labels: [],//graphLabels - not shown now because of trouble formatting to look good in large data amounts,
        datasets: [
          {
            data: graphData,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
            strokeWidth: 4, // optional
            stroke: "#fff"
          },
          // {
          //   data: [8,7],
          //   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
          //   strokeWidth: 4, // optional
          //   stroke: "#fff"
          // },
          {
            data: [10,0], // <=== e.g: [400], the maximum you want, only one value in the array.
            color: () => `rgba(0, 0, 0, 0)`, // <=== Here enable transparency of the rgba() to hide the max Y Value dot from your chart.
          },
        ],
        legend: [graphTitle], // optional
    };
    const {colors, isDark} = useTheme();
    return (
        <LineChart
            data={data}
            width={width/1.1}
            height={256}
            // verticalLabelRotation={30}
            chartConfig={chartConfig}
            style={styles(colors).graph}
            withShadow={false}
            hideLegend={false}
        />
    );
}

const styles = (colors) => StyleSheet.create({
  graph: {
    alignItems: 'center',
    borderRadius: 5,
  },
  labels: {
    fontSize: 22,
  },
});