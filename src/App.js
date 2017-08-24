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
            <SplitPane split="horizontal" size="16%">
                <div><InputSection onSubmit={this.submit}/></div>
                <SplitPane split="horizontal" size="96%">
                    <SplitPane split="vertical" size="30%">
                    <div></div>
                    <div></div>
                    </SplitPane>
                    <div></div>
                </SplitPane>
            </SplitPane>
      </div>
    );
  }
}

export default App;
