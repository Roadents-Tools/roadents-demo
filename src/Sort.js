import React, { Component } from 'react';

export default class RouteMap extends Component {
  constructor(props) {
    super(props);
    this.sortChange = this.sortChange.bind(this);
    this.directionChange = this.directionChange.bind(this);
    this.state = {
      sort : 0
    }
  }

  buildSortOptions() {
    return [
      <option value={0}>Time</option>,
      <option value={8}>Labor</option>,
      <option value={2}>Steps</option>,
      <option value={4}>Distance</option>,
      <option value={6}>Length</option>
    ]
  }

  buildDirectionOptions() {
    return [
      <option value={0}>Ascending</option>,
      <option value={1}>Descending</option>
    ]
  }

  sortChange(e) {
    var val = parseInt(e.target.value, 10);
    var dir = this.state.sort % 2;
    this.setState({sort : dir + val});
    if(this.props.onChange) this.props.onChange(dir + val);
  }

  directionChange(e) {
    var val = parseInt(e.target.value, 10);
    var sort = this.state.sort - this.state.sort % 2;
    this.setState({sort : sort + val});
    if(this.props.onChange) this.props.onChange(sort + val);
  }

  render() {
    return <div>
      Sort by:
      <select className="sort-dropdown" onChange={this.sortChange} value={this.state.sort - this.state.sort % 2}>
        {this.buildSortOptions()}
      </select>
      <select className="sort-dropdown" onChange={this.directionChange} value={this.state.sort % 2}>
        {this.buildDirectionOptions()}
      </select>
    </div>
  }
}
