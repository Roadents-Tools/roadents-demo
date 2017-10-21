import React, { Component } from 'react';


export default class MaxDelta extends Component {

    constructor(props) {
        super(props);

        this.maxDeltaChange = this.maxDeltaChange.bind(this);
        this.buildDeltaOptions = this.buildDeltaOptions.bind(this);
        this.incrementDelta = this.incrementDelta.bind(this);
        this.decrementDelta = this.decrementDelta.bind(this);

        this.state = {"maxDelta" : 15};
    }

    maxDeltaChange(e) {
        this.setState({"maxDelta": parseInt(e.target.value, 10)})
        console.log("Setting dest maxDelta: "+JSON.stringify(this.getDelta()));
    }

    getDelta() {
        return this.state.maxDelta;
    }

    buildDeltaOptions() {
        return [this.state.maxDelta, 15, 30, 45, 60, 90]
            .map(i => {
                if(i === 60) return {label : '1 hour', value : i};
                else if(i > 60 && i < 120) return {label: Math.floor(i/60) +' hour '+i%60+' minutes', value : i}
                else if(i % 60 === 0) return {label: Math.floor(i/60) +' hours ', value : i}
                else if(i > 60) return {label: Math.floor(i/60) +' hours '+i%60+' minutes', value : i}
                else return {label :i+' minutes', value: i}
            })
            .map(obj => <option value={obj.value}>{obj.label}</option>);
    }

    incrementDelta() {
        if(this.state.maxDelta >= 90) return;
        var inc = 1 + this.state.maxDelta;
        this.setState({"maxDelta":inc})
    }

    decrementDelta() {
        if(this.state.maxDelta <= 1) return;
        this.setState({"maxDelta":this.state.maxDelta - 1})
    }

    render () {
        return <div className="max-delta">
            <select className="max-delta-select" onChange = {this.maxDeltaChange} value={this.state.maxDelta}>
                {this.buildDeltaOptions()}
            </select>
        </div>
    }
}
