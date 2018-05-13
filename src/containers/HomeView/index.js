import React, { Component }   from 'react'
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter }         from 'react-router-dom';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash'
import * as lineChartActionCreators from 'core/actions/time-series';
import { format } from "d3-format"
import {TimeSeries} from 'pondjs'
import {ChartContainer, ChartRow, Charts, YAxis, LineChart, Baseline, Legend, Resizable, styler} from 'react-timeseries-charts'

const style = styler([
  { key: "eth", color: "steelblue", width: 2 },
  { key: "btc", color: "steelblue", width: 2 }
]);

class CrossHairs extends React.Component {
  render() {
      const { x, y } = this.props;
      const style = { pointerEvents: "none", stroke: "#ccc" };
      if (!_.isNull(x) && !_.isNull(y)) {
          return (
              <g>
                  <line style={style} x1={0} y1={y} x2={this.props.width} y2={y} />
                  <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
              </g>
          );
      } else {
          return <g />;
      }
  }
}

class HomeView extends React.Component {
  state = {
      currency: 'btc',
      tracker: null,
      // timerange: this.props.timeSeries.range(),
      x: null,
      y: null
  }

  constructor (props) {
    super(props)
    props.api.loadPrices({currency: this.state.currency})
  }

  willComponentMount() {
    this.state.timerange = this.state.timerange || this.props.timeSeries.range()
  }

  handleTrackerChanged = tracker => {
      if (!tracker) {
          this.setState({ tracker, x: null, y: null });
      } else {
          this.setState({ tracker });
      }
  };

  handleTimeRangeChange = timerange => {
    this.setState({ timerange });
  };

  handleMouseMove = (x, y) => {
    this.setState({ x, y });
  };

  handleCurrencyChange = (event, index, value) => {
    this.setState({currency: value})
    this.props.api.loadPrices({currency: value})
  }

  render() {
    if (!this.props.timeSeries) {
      return (null)
    }
    const f = format("$,.2f");
    const range = this.state.timerange || this.props.timeSeries.range();

    let ccyValue;
    if (this.state.tracker) {
        const index = this.props.timeSeries.bisect(this.state.tracker);
        const trackerEvent = this.props.timeSeries.at(index);
        ccyValue = `${f(trackerEvent.get(this.state.currency))}`;
    }

    return (
        <div>
            <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                <SelectField
                  floatingLabelText="Currency"
                  style={{width: 100}}
                  value={this.state.currency}
                  onChange={this.handleCurrencyChange}
                >
                  <MenuItem value="btc" primaryText="BTC" />
                  <MenuItem value="eth" primaryText="ETH" />
                </SelectField>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Resizable>
                        <ChartContainer
                            timeRange={range}
                            paddingRight={100}
                            // maxTime={this.props.timeSeries.range().end()}
                            // minTime={this.props.timeSeries.range().begin()}
                            timeAxisAngledLabels={true}
                            timeAxisHeight={65}
                            onTrackerChanged={this.handleTrackerChanged}
                            onBackgroundClick={() => this.setState({ selection: null })}
                            enablePanZoom={true}
                            onTimeRangeChanged={this.handleTimeRangeChange}
                            onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                            minDuration={1000 * 60 * 60 * 24 * 30}
                        >
                            <ChartRow height="400">
                                <YAxis
                                    id="y"
                                    label="Price ($)"
                                    labelOffset={-40}
                                    // min={0.5}
                                    // max={3}
                                    min={this.props.timeSeries.crop(range).min(this.state.currency)}
                                    max={this.props.timeSeries.crop(range).max(this.state.currency)}
                                    width="100"
                                    type="linear"
                                    format="$,.2f"
                                />
                                <Charts>
                                    <LineChart
                                        axis="y"
                                        breakLine={false}
                                        series={this.props.timeSeries}
                                        columns={[this.state.currency]}
                                        // style={style}
                                        interpolation="curveBasis"
                                        highlight={this.state.highlight}
                                        onHighlightChange={highlight =>
                                            this.setState({ highlight })
                                        }
                                        selection={this.state.selection}
                                        onSelectionChange={selection =>
                                            this.setState({ selection })
                                        }
                                    />
                                    <CrossHairs x={this.state.x} y={this.state.y} />
                                </Charts>
                            </ChartRow>
                        </ChartContainer>
                    </Resizable>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <span>
                        <Legend
                            type="line"
                            align="right"
                            style={style}
                            categories={[
                                { key: this.state.currency, label: this.state.currency.toUpperCase(), value: ccyValue }
                            ]}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {timeSeries: state.history.timeSeries}
}

function mapDispatchToProps(dispatch) {
  return {
    api: bindActionCreators(lineChartActionCreators, dispatch)
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeView))
