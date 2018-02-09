import React, {Component} from 'react';
import {displacement, totalTime} from './SortUtils';

export default class ResultListItem extends Component{

  constructor(props) {
    super(props);
    this.state = {
      showNodes : false,
    }
    this.toggleNodes = this.toggleNodes.bind(this);
    this.generateHeader = this.generateHeader.bind(this);
    this.generateNodes = this.generateNodes.bind(this);
  }

  toggleNodes() {
    if(!this.state.showNodes && this.props.onselect) {
      this.props.onselect(this.props.route);
    }
    this.setState({showNodes: !this.state.showNodes});
  }

  getInstructions(nodes) {
    return [{"step_type" : "start"}].concat(nodes).map(nd => this.getInstruction(nd));
  }

  getInstruction(node) {
      if(node["step_type"] === "walk") {
        var endpoint = node.end_point.name;
        var mins = Math.round(node.total_time/60);
        var secs = Math.round((node.total_time) % 59);
        if(mins > 0) return `Walk for ${mins} minutes, ${secs} seconds to ${endpoint}`;
        else return `Walk for ${secs} seconds to ${endpoint}`;
      }
      else if(node["step_type"] === "transit"){
        var endpoint = node.end_point.name;
        var waitmins = Math.round(node.wait_time/60);
        var waitsecs = Math.round((node.wait_time) % 59);
        var tmins = Math.round(node.travel_time/60);
        var tsecs = Math.round((node.travel_time) % 59);

        var rval = `Wait for the ${node.agency} ${node.route} ${node.transit_type} and then ride for ${node.stops} stops. This should take around ${Math.round(node.total_time/60)} minutes.`
        return rval;
      }
      else {
        return `Start at ${this.props.query}.`;
      }
    }

  generateHeader(showNodes) {
    var header = this.props.route.end_point.name;
    if(this.props.route.end_point.address) {
      header += " - " + this.props.route.end_point.address;
    }
    if (!showNodes) {
      return <div className="result-list-item-header" onClick={this.toggleNodes}>
        <div className="result-list-item-title">
          {header}
        </div>
        <div className="result-list-item-subtitle">
          {Math.round(totalTime(this.props.route)/(60))+" mins, "+displacement(this.props.route).toFixed(2)+" km"}
        </div>
      </div>

    }
    else {
      return <div className="result-list-item-header" onClick={this.toggleNodes}>
        <div className="result-list-item-title">
          {header}
        </div>
        <div className="result-list-item-subtitle">
          {Math.round(totalTime(this.props.route)/(60))+" mins, "+displacement(this.props.route).toFixed(2)+" km"}
        </div>
      </div>

    }
  }


  generateNodes() {
    return this.getInstructions(this.props.route.steps)
    .filter((instr, i) => {return !(i > 0 && instr.startsWith("Start"))})
    .map(nd => {
      return <div className="result-list-item-node">
        {nd}
      </div>
    })
  }

  render() {
    if(!this.state.showNodes) {
      return (
        <div className="result-list-item">
          {this.generateHeader(false)}
        </div>
      );
    }

    else {
      return (
        <div className="result-list-item">
          {this.generateHeader(true)}
          <div className="result-list-item-nodelist">
            {this.generateNodes()}
          </div>
        </div>
      );
    }

  }
}
