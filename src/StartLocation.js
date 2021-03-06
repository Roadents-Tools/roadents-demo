import React, { Component } from 'react';

export default class StartLocation extends Component {

    constructor(props) {
        super(props);

        this.locationChange = this.locationChange.bind(this);
        this.getLocation = this.getLocation.bind(this);

        this.state = {"address" : "40.74702, -73.99097"};
    }

    locationChange(e) {
        this.setState({"address": e.target.value})
    }

    getLocation() {
        return this.state.address;
    }

    render () {
        return <div>
            <input type="text" value={this.state.address} onChange={this.locationChange}/>
        </div>
    }
}
