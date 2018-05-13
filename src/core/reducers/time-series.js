import constants from 'core/types'

export function timeSeriesReducer(state = {}, action) {
  switch (action.type) {

  case constants.LOAD_PRICES:
    return Object.assign({}, state, {
      timeSeries: action.value
    });
  
  default:
    return state;
  }
}
