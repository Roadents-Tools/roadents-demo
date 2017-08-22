import React, { Component } from 'react';

export default class DestinationQuery extends Component {

    constructor(props) {
        super(props);

        this.queryChange = this.queryChange.bind(this);
        this.getQuery = this.getQuery.bind(this);

        this.state = {"query" : "Ex: Walmart"};
    }

    queryChange(e) {
        this.setState({"query": e.target.value})
        console.log("Setting dest query: "+JSON.stringify(this.getQuery()));
    }

    getQuery() {
        return this.state;
    }

    render () {
        return <div>
            <input type="text" value={this.state.query} onChange={this.queryChange}/>
        </div>
    }
}
