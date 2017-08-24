import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import StartTime from './StartTime';
import DestinationQuery from './DestinationQuery';
import MaxDelta from './MaxDelta';
import StartLocation from './StartLocation';

export default class InputSection extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.getRequest = this.getRequest.bind(this);
    }

    submit() {
        this.props.onSubmit(this.getRequest());
    }

    getRequest() {

        //Get start time
        var date = new Date();
        var straw = this.t.getTime();
        date.setHours(straw.hour + (straw.pm) ? 12 : 0);
        date.setMinutes(straw.minute);
        var startTime = Math.floor(date.getTime()/1000);

        //TODO: Get the start latlng from raw start location;
        var praw = this.p.getLocation();
        var startLocation = praw;

        //Get the delta time
        var dtraw = this.dt.getDelta();
        var maxDelta = dtraw * 60;

        //Get the final locations query
        var query = this.q.getQuery();

        return {
            "startTime" : startTime,
            "startLocation" : startLocation,
            "maxDelta" : maxDelta,
            "query" : query
        };
    }

    render () {
        return <SplitPane split="vertical" style={{"padding-top" : "30%"}} size="50%" className = "Start-Section">
          <SplitPane split="vertical" size="50%">
              <div className="input-item">
                <StartTime ref={t => {this.t=t}} className="input-item"/>
                <div className="title">StartTime</div>
              </div>
              <div className="input-item">
                  <StartLocation ref={(p) => {this.p = p}} className="input-item"/>
                  <div className="title">StartLocation</div>
              </div>
          </SplitPane>
          <SplitPane split="vertical" size="50%">
              <div className="input-item">
                  <DestinationQuery ref={(q) => {this.q = q}}/>
                  <div className="title">Query</div>
              </div>
              <div className="input-item">
                  <MaxDelta onSubmit={this.submit} ref={(dt) => {this.dt = dt}}/>
                  <div className="title"> Max Delta</div>
              </div>
          </SplitPane>
        </SplitPane>
    }

}
