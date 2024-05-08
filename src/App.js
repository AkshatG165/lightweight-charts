import './App.css';
import { ColorType, createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import OHLC from './OHLC';
import { db, rtdb } from './firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { ref, onValue, off } from 'firebase/database';

function offsetDate(ohlc) {
  return {
    time: Math.floor(
      new Date(ohlc.time * 1000 + 5.5 * 60 * 60 * 1000).getTime() / 1000
    ),
    open: ohlc.open,
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
  };
}

export const ChartComponent = () => {
  const chartContainerRef = useRef();
  const [highestHigh, setHighestHigh] = useState(0);
  const [currentCandle, setCurrentCandle] = useState(null);
  const [ohlc, setohlc] = useState([]);

  //for getting initial ohlc data
  useEffect(() => {
    async function getData() {
      const data = [];
      const q = query(collection(db, 'ohlc2'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => data.push(offsetDate(doc.data())));

      if (data.length === 0) return;
      setohlc(data.sort((a, b) => a.time - b.time));

      setHighestHigh(
        data.reduce(
          (maxHigh, currentItem) => Math.max(maxHigh, currentItem.high),
          -Infinity
        )
      );
    }
    getData();
  }, []);

  //for plotting chart
  useEffect(() => {
    const chartOptions = {
      layout: {
        textColor: 'black',
        background: { type: ColorType.Solid, color: 'white' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 700,
      crosshair: { mode: 0 },
    };
    const chart = createChart(chartContainerRef.current, chartOptions);

    //setting timescale options
    chart.timeScale().applyOptions({
      rightOffset: 35,
      timeVisible: true,
      barSpacing: 10,
      minBarSpacing: 1,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(ohlc);
    // chart.timeScale().fitContent();

    //for showing ohlc data when cursor hovers over candles
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(candlestickSeries);
        setCurrentCandle(data);
      }
    });

    // for plotting trailing profit line
    const trailingProfit = {
      price: highestHigh * 0.8,
      color: 'black',
      lineWidth: 1,
      axisLabelVisible: true,
      title: 'Trailing profit',
      lineStyle: 0,
    };
    candlestickSeries.createPriceLine(trailingProfit);

    onValue(ref(rtdb, '/'), (snapshot) => {
      candlestickSeries.update(offsetDate(snapshot.val()));
      if (snapshot.val().high > highestHigh)
        setHighestHigh(snapshot.val().high);
    });

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      off(ref(rtdb, '/'));
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ohlc, highestHigh]);

  return (
    <div ref={chartContainerRef} className="chart-container">
      {currentCandle && <OHLC currentCandle={currentCandle} />}
    </div>
  );
};

export function App() {
  return <ChartComponent />;
}

export default App;
