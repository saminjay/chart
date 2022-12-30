import React, { useState, useEffect } from 'react';
import CanvasJSReact from '../lib/canvasjs/canvasjs.react';

// const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const options = {
  animationEnabled: true,
  exportEnabled: true,
  theme: "light2", // "light1", "dark1", "dark2"
  title:{
    text: "Revenue Data"
  },
  axisY: {
    title: "ACV",
  },
  axisX: {
    title: "Month",
    labelFormatter: (e) => months[e.value],
  },
  legend: {
    horizontalAlign: 'left',
    verticalAlign: 'bottom',
  },
  data: [],
};


export default function LineGraph ({ data }) {
  const [normalisedData, setNormalisedData] = useState([]);

  useEffect(() => {
    const productSum = {};
    data.forEach(({ product, month, acv }) => {
      if (!productSum[product]) {
        productSum[product] = {
          [month.substr(0, 3)]: acv,
        };
      } else {
        productSum[product][month.substr(0, 3)] += acv;
      }
    })
    setNormalisedData(Object.keys(productSum).map((product) => ({
      type: 'spline',
      toolTipContent: `${product} :{y}`,
      showInLegend: true,
      name: product,
      dataPoints: months.map((month, idx) => ({ x: idx, y: productSum[product][month] })),
    })));
  }, [data]);
  return <CanvasJSChart options={{ ...options, data: normalisedData }} />;
}