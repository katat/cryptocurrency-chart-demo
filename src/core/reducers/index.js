import { combineReducers } from 'redux';
import { timeSeriesReducer }     from 'core/reducers/time-series';

const rootReducer = combineReducers({
  history: timeSeriesReducer
});

export default rootReducer;
