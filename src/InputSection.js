import React, { Component } from 'react';
import StartTime from './StartTime';
import DestinationQuery from './DestinationQuery';
import MaxDelta from './MaxDelta';
import StartLocation from './StartLocation';
import {geocode} from './LocationUtils';

export default class InputSection extends Component {

  constructor(props, context) {
        super(props, context);
        this.submit = this.submit.bind(this);
        this.getRequest = this.getRequest.bind(this);
        this.state = {
          request : {}
        }
    }

    submit() {
        this.getRequest()
          .then(e => {this.props.onSubmit(e)});
    }

    getRequest() {

        //Get start time
        var date = new Date();
        var straw = this.t.getTime();
        date.setHours(straw.hour + (straw.pm) ? 12 : 0);
        date.setMinutes(straw.minute);
        var startTime = Math.floor(date.getTime()/1000);

        //Get the delta time
        var dtraw = this.dt.getDelta();
        var maxDelta = dtraw * 60;

        //Get the final locations query
        var query = this.q.getQuery();

        //Since geocoding is done Async, we return a promise.
        var praw = this.p.getLocation();
        return geocode(praw)
          .then(loc =>{ return {
            "startTime" : startTime,
            "startLocation" : loc,
            "maxDelta" : maxDelta,
            "query" : query,
            "startAddress" : praw
          }})
          .then(req => {
            this.setState({request : req});
            return req;
          })
    }

    static get contextTypes() {
      return {
        muiTheme: React.PropTypes.object
      };
    }

    render () {
        return (
          <div id="InputSection" className="input-section">
            <div id="startTime" className="start-time"><StartTime ref={t => {this.t=t}}/></div>
            <div id="startLocation" className="start-location"><StartLocation ref={p => {this.p=p}}/></div>
            <div id="destinationQuery" className="destination-query"><DestinationQuery ref={q => {this.q=q}}/></div>
            <div id="maxDelta" className="max-delta"><MaxDelta ref={dt => {this.dt=dt}}/></div>
            <div id="startTimeLbl" className="start-time-label">Start Time</div>
            <div id="startLocationLbl" className="start-location-label">Start Location</div>
            <div id="destinationQueryLbl" className="destination-query-label">Destination Query</div>
            <div id="maxDeltaLbl" className="max-delta-label">Max Delta</div>
            <div id="rerouteBtn" className="reroute-button"><button id="reroute-button-id" onClick={this.submit}>Reroute!</button></div>
          </div>)
    }
}
