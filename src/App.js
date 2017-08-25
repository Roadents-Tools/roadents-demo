import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import './App.css';
import InputSection from './InputSection.js'

class App extends Component {

  constructor(props) {
    super(props);
  }

  submit(e) {
    console.log(JSON.stringify(e));
  }

  render() {
    return (
      <div className="App">
            <SplitPane split="horizontal" size="10%">
                <div style={{height: "100%", width: "100%", "background-color": "blue"}}><InputSection onSubmit={this.submit}/></div>
                <SplitPane split="horizontal" size="96%">
                    <SplitPane split="vertical" size="25%">
                    <div style={{height: "100%", width: "100%", "background-color" : "green"}}></div>
                    <div style={{height: "100%", width: "100%", "background-color" : "orange"}}></div>
                    </SplitPane>
                    <div style={{height : "100%", width: "100%", "background-color" : "magenta"}}></div>
                </SplitPane>
            </SplitPane>
      </div>
    );
  }
}

export default App;
