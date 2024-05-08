import './OHLC.css';

export default function OHLC({ currentCandle }) {
  return (
    <div className="ohlc-data">
      <p>
        O
        <span
          className={currentCandle.open < currentCandle.close ? 'green' : 'red'}
        >
          {currentCandle.open}
        </span>
      </p>
      <p>
        H
        <span
          className={currentCandle.open < currentCandle.close ? 'green' : 'red'}
        >
          {currentCandle.high}
        </span>
      </p>
      <p>
        L
        <span
          className={currentCandle.open < currentCandle.close ? 'green' : 'red'}
        >
          {currentCandle.low}
        </span>
      </p>
      <p>
        C
        <span
          className={currentCandle.open < currentCandle.close ? 'green' : 'red'}
        >
          {currentCandle.close}
        </span>
      </p>
    </div>
  );
}
