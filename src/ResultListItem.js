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
    return nodes.map(nd => this.getInstruction(nd));
  }

  getInstruction(node) {
      var endpt = node.pt[Object.keys(node.pt)[0]].name;
      if(node.walkTimeFromPrev !== 0) {
        var mins = Math.round(node.walkTimeFromPrev/60000);
        var secs = Math.round((node.walkTimeFromPrev / 1000) % 60);
        if(mins > 0) return `Walk for ${mins} minutes, ${secs} seconds to ${endpt}`;
        else return `Walk for ${secs} seconds to ${endpt}`;
      }
      else if(node.travelTimeFromPrev !==0){
        var waitmins = Math.round(node.waitTimeFromPrev/60000);
        var waitsecs = Math.round((node.waitTimeFromPrev / 1000) % 60);
        var tmins = Math.round(node.travelTimeFromPrev/60000);
        var tsecs = Math.round((node.travelTimeFromPrev / 1000) % 60);

        var rval = "Wait for "
        if(waitmins > 0) rval += `${waitmins} minutes, `;
        rval+= `${waitsecs} seconds and then ride for `;
        if(tmins > 0) rval += `${tmins} minutes, `;
        rval += `${tsecs} seconds.`;
        return rval;
      }
      else {
        return `Start at ${this.props.query}.`;
      }
    }

  generateHeader(showNodes) {
    if (!showNodes) {
      return <div className="result-list-item-header" onClick={this.toggleNodes}>
        <div className="result-list-item-title">
          {this.props.route.dest.name + " - " +this.props.route.dest.address}
        </div>
        <div className="result-list-item-subtitle">
          {Math.round(totalTime(this.props.route)/(1000 * 60))+" mins, "+displacement(this.props.route).toFixed(2)+" km"}
        </div>
      </div>

    }
    else {
      return <div className="result-list-item-header" onClick={this.toggleNodes}>
        <div className="result-list-item-title">
          {this.props.route.dest.name + " - " +this.props.route.dest.address}
        </div>
        <div className="result-list-item-subtitle">
          {Math.round(totalTime(this.props.route)/(1000 * 60))+" mins, "+displacement(this.props.route).toFixed(2)+" km"}
        </div>
      </div>

    }
  }


  generateNodes() {
    return this.getInstructions(this.props.route.route).map(nd => {
      return <div className="result-list-item-node">
        {nd}
      </div>
    });
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
