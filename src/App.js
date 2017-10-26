import React, { Component } from 'react';
import './App.css';
import InputSection from './InputSection.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import routes from './testroutes6.js';
import ResultList from './ResultList.js'
import RouteMap from './RouteMap.js';
import {displacement, nodeCount} from './SortUtils.js';
import {delay} from './PromiseUtils.js';

class App extends Component {
  static get contextTypes() {
    return {
      muiTheme: React.PropTypes.object
    };
  }

  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);
    this.state = {
      "routes" : [],
      "loaded" : [],
      "selected" : -1,
      "sortNum" : 0,
      "query" : {
        "startTime" : -1,
        "startLocation" : {
          "latitude" : -1,
          "longitude" : -1
        },
        "maxDelta" : -1,
        "query" : "NULL",
        "startAddress" : "NULL"
      }
    }
  }

  submit(e) {
    delay(0 * 1000, routes.map(rt => {
      var nrt = JSON.parse(JSON.stringify(rt));
      nrt.dest.name = nrt.dest.name + `(${e.query})`;
      return nrt;
    }))
    .then(rts => {
        this.setState({
          "routes" : rts,
          "query" : e
        })
      }
    )
    .catch((err) => {console.log(err)})
  }


  render() {
    return (
      <MuiThemeProvider>
        <div id="App" className="App">
          <InputSection onSubmit={this.submit}/>
          <div id="Result" className="results">
            <ResultList query={this.state.query} routes={this.state.routes} sortNum={1} onload = {rts => this.setState({loaded : rts})} onselect={i => this.setState({selected : i})}/>
          </div>
          <div id="Map" className="map">
            <RouteMap routes={this.state.loaded} selected={this.state.selected}/>
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
