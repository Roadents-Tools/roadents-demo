import React, { Component } from 'react';
import './App.css';
import InputSection from './InputSection.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import routes from './testroutes6.js';
import ResultList from './ResultList.js'
import RouteMap from './RouteMap.js';
import Sort from './Sort.js';
import {displacement, nodeCount} from './SortUtils.js';
import {delay, call} from './PromiseUtils.js';

const BASE_URL = 'http://localhost:4567/demo';
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
    call(this.buildUrl(e))
      .then(rts => rts.map(rt => {
        var nrt = JSON.parse(JSON.stringify(rt));
        if(nrt.dest) nrt.dest.name = nrt.dest.name + `(${e.query})`;
        return nrt;
      }))
      .catch((err) => {console.log(err);})
      .then(rts => {
          this.setState({
            "routes" : rts,
            "query" : e
          })
      })
      .catch((err) => {console.log(err)})
  }

  buildUrl(query) {
    return `${BASE_URL}?latitude=${query.startLocation.latitude}&longitude=${query.startLocation.longitude}&starttime=${query.startTime}&timedelta=${query.maxDelta}&type=${query.query}`;
  }

  render() {
    console.log(this.state.sortNum);
    return (
      <MuiThemeProvider>
        <div id="App" className="App">
          <InputSection onSubmit={this.submit}/>
          <div id="Result" className="results">
            <ResultList query={this.state.query} routes={this.state.routes} sortNum={this.state.sortNum} onload = {rts => this.setState({loaded : rts})} onselect={i => this.setState({selected : i})}/>
          </div>
          <div id="Map" className="map">
            <RouteMap routes={this.state.loaded} selected={this.state.selected}/>
          </div>
          <div id="Sort" className="sort">
            <Sort onChange={s => this.setState({sortNum : s})}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
