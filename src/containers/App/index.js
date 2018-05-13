import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import injectTapEventPlugin   from 'react-tap-event-plugin';
import MuiThemeProvider       from 'material-ui/styles/MuiThemeProvider';
import muiTheme               from './styles/theme/mui-theme'
import { HashRouter,
         Route,
         Redirect,
         Switch }             from 'react-router-dom';

/* 
 * Import global styles into entire app 
 */
import './styles/app.scss';


/* application containers & components */
import HomeView       from 'containers/HomeView';

injectTapEventPlugin();

export class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <HashRouter>
            <div>
              <div className="container">
                <Switch>
                  <Route path="/home" component={HomeView} />
                  <Redirect from="/" to="/home" />
                </Switch>
              </div>
            </div>
          </HashRouter>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    ui: state.ui
  };
}

export default connect(mapStateToProps, null)(App);
