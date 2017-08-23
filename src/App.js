import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import StartTime from './StartTime.js'
import StartLocation from './StartLocation.js'
import DestinationQuery from './DestinationQuery.js'
import MaxDelta from './MaxDelta.js'

class App extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit() {
    [this.t.getTime(), this.p.getLocation(), this.q.getQuery(), this.dt.getDelta()]
        .map(a => JSON.stringify(a))
        .forEach(a => console.log(a));
  }

  render() {
    return (
      <div className="App">
        <div className = "Start-Section">
          <div className="input-item">
            <StartTime ref={t => {this.t=t}} className="input-item"/>
          </div>
          <div className="input-item">
              <StartLocation ref={(p) => {this.p = p}} className="input-item"/>
          </div>
          <div className="input-item">
              <DestinationQuery ref={(q) => {this.q = q}}/>
          </div>
          <div className="input-item">
              <MaxDelta onSubmit={this.submit} ref={(dt) => {this.dt = dt}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
