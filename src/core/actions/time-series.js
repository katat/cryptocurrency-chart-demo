import constants from 'core/types';
import axios from 'axios'
import {TimeSeries} from 'pondjs'
import timeseries from 'pondjs/lib/lib/timeseries';

const key = 'ABEA8A91-1466-48C9-B4FB-18B08F23935E'
// const key = '180C25CE-4658-4F69-AE6A-C6B104A4E08A'
const buildTimeSeries = (data, currency = 'btc') => {
  const points = data.map(point => {
    return [new Date(point.time_close).getTime(), point.price_close]
  })
  const timeSeries = new TimeSeries({
    name: "Price",
    columns: ["time", currency],
    points
  })
  return timeSeries
}

export function loadPrices(obj) {
  // return dispatch => {
  //   const options = {
  //     method: 'GET',
  //     headers: { 'X-CoinAPI-Key': key },
  //     url: 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history?period_id=1DAY&time_start=2009-01-01T00:00:00&limit=100'
  //   };
  //   axios(options).then(res => {
  //     res = {
  //       data: require(`../../../data/${obj.currency}.json`)
  //     }
  //     const timeSeries = buildTimeSeries(res.data, obj.currency)
  //     dispatch({
  //       type: constants.LOAD_PRICES,
  //       value: timeSeries
  //     })
  //   })
  // }
  const mockData = require(`../../../data/${obj.currency}.json`)
  return {
    type: constants.LOAD_PRICES,
    value: buildTimeSeries(mockData, obj.currency)
  }
}
