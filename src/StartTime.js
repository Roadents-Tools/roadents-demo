import React, { Component } from 'react';

export default class StartTime extends Component {

    constructor(props) {
        super(props);

        this.hourChange = this.hourChange.bind(this);
        this.minuteChange = this.minuteChange.bind(this);
        this.pmChange = this.pmChange.bind(this);
        this.getTime = this.getTime.bind(this);

        var d = new Date();
        console.log("DDDDD "+d+" DDDDD")
        var hour = d.getHours();
        var minute = d.getMinutes();
        var ampm = hour < 12 ? "AM" : "PM";
        if(hour === 0) {
            hour = 12;
        }
        else if(hour > 12) {
            hour -= 12;
        }

        this.state = {"hour" : hour, "minute" : minute, "pm" : ampm};
    }


    hourChange(e) {
        this.setState({"hour" : parseInt(e.target.value, 10)});
        console.log("Setting start time to: " + JSON.stringify(this.getTime()));
    }

    minuteChange(e) {
        this.setState({"minute": parseInt(e.target.value, 10)});
        console.log("Setting start time to: " + JSON.stringify(this.getTime()));
    }

    pmChange(e) {
        this.setState({"pm": e.target.value});
        console.log("Setting start time to: " + JSON.stringify(this.getTime()));
    }

    getTime() {
        return this.state;
    }

    padOnes(i) {
        if(i < 10) return '0'+i;
        else return i;
    }

    render () {
        return <div>
            <select onChange={this.hourChange} value={this.state.hour}>
                {[...Array(12).keys()].map(i=> <option value = {i+1}>{i+1}</option>)}
            </select>
            :
            <select onChange={this.minuteChange} value={this.state.minute}>
                {[...Array(60).keys()].map(i=> <option value = {i}>{this.padOnes(i)}</option>)}
            </select>
            <select onChange={this.pmChange} value = {this.state.pm} >
                <option value = "AM">AM</option>
                <option value = "PM">PM</option>
            </select>
        </div>
    }
}
