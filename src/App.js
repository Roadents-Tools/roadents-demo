import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import './App.css';
import InputSection from './InputSection.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  static get contextTypes() {
    return {
      muiTheme: React.PropTypes.object
    };
  }

  constructor(props, context) {
    super(props, context);
  }

  submit(e) {
    console.log(JSON.stringify(e));
  }

  render() {
    return (
      <MuiThemeProvider>
        <div id="App" className="App">
          <InputSection/>
          <div id="Result" className="results">
            <p>Result List</p>
          </div>
          <div id="Map" className="map">
            <p>Map</p>
          </div>
          <div id="Sort" className="sort">
            <p>Sort</p>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
