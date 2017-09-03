import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {reverseGeocode} from './LocationUtils';
import {displacement, totalTime} from './SortUtils';

export default class ResultListItem extends Component{

  constructor(props) {
    super(props);
    this.state = {
      showNodes : false
    }
    this.toggleNodes = this.toggleNodes.bind(this);
  }

  toggleNodes() {
    this.setState({showNodes: !this.state.showNodes});
  }

  getInstruction(node) {
    if(node.walkTimeFromPrev !== 0) {
      var mins = Math.round(node.walkTimeFromPrev/60000);
      var secs = Math.round((node.walkTimeFromPrev / 1000) % 60);
      var endpt = reverseGeocode(node.pt[Object.keys(node.pt)[0]]);
      if(mins > 0) return `Walk for ${mins} minutes, ${secs} seconds to ${endpt}`;
      else return `Walk for ${secs} seconds to ${endpt}`;
    }
    else if(node.travelTimeFromPrev !==0){
      var waitmins = Math.round(node.waitTimeFromPrev/60000);
      var waitsecs = Math.round((node.waitTimeFromPrev / 1000) % 60);
      var tmins = Math.round(node.travelTimeFromPrev/60000);
      var tsecs = Math.round((node.travelTimeFromPrev / 1000) % 60);
      var endpt = reverseGeocode(node.pt[Object.keys(node.pt)[0]]);

      var rval = "Wait for "
      if(waitmins > 0) rval += `${waitmins} minutes, `;
      rval+= `${waitsecs} seconds and then ride for `;
      if(tmins > 0) rval += `${tmins} minutes, `;
      rval += `${tsecs} seconds.`;
      return rval;
    }
    var endpt = reverseGeocode(node.pt[Object.keys(node.pt)[0]]);
    return `Start at ${endpt}`;
  }

  generateHeader() {
        return <div className="result-list-item-header" onClick={this.toggleNodes}>
          <div className="result-list-item-title">
            {this.props.query + " - " + reverseGeocode(this.props.route.dest)}
          </div>
          <div className="result-list-item-subtitle">
            {Math.round(totalTime(this.props.route)/(1000 * 60))+" mins, "+displacement(this.props.route).toFixed(2)+" km"}
          </div>
        </div>
  }


  generateNodes(route) {
    return route.route.map(nd => this.generateNode(nd));
  }

  generateNode(node) {
    return <div className="result-list-item-node">
      {this.getInstruction(node)}
    </div>
  }

  render() {
    if(!this.state.showNodes) {
      return (
        <div className="result-list-item">
          {this.generateHeader()}
        </div>
      );
    }
    else {
      return (
        <div className="result-list-item">
          {this.generateHeader()}
          <div className="result-list-item-nodelist">
            {this.generateNodes(this.props.route)}
          </div>
        </div>
      );
    }
  }
}
