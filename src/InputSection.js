import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import StartTime from './StartTime';
import DestinationQuery from './DestinationQuery';
import MaxDelta from './MaxDelta';
import StartLocation from './StartLocation';

export default class InputSection extends Component {

  constructor(props, context) {
        super(props, context);
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

    static get contextTypes() {
      return {
        muiTheme: React.PropTypes.object
      };
    }

    render () {
        return (
          <div id="InputSection" className="input-section">
            <div id="startTime" className="start-time"><StartTime/></div>
            <div id="startLocation" className="start-location"><StartLocation/></div>
            <div id="destinationQuery" className="destination-query"><DestinationQuery/></div>
            <div id="maxDelta" className="max-delta"><MaxDelta/></div>
            <div id="startTimeLbl" className="start-time-label">Start Time</div>
            <div id="startLocationLbl" className="start-location-label">Start Location</div>
            <div id="destinationQueryLbl" className="destination-query-label">Destination Query</div>
            <div id="maxDeltaLbl" className="max-delta-label">Max Delta</div>
            <div id="rerouteBtn" className="reroute-button"><button>Reroute!</button></div>
          </div>)
    }
}
