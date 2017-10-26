import React, {Component} from 'react';
import ResultListItem from './ResultListItem.js';
import deepEquals from 'deep-equals';

const ADD_PER_LOAD = 5;
const INITIAL_LOAD = 5;
const MAX_LOAD = 20;

export default class ResultList extends Component{

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.addItem = this.addItem.bind(this);
    this.reloadRoutes = this.reloadRoutes.bind(this);
    this.items =[];
    this.state = {
      loadedRoutes : [],
      sortNum : 0,
      lq : {}
    };
    this.reloadRoutes();
  }

  reloadRoutes() {
    if(deepEquals(this.props.query, this.state.lq)) {
      return;
    }
    this.offset = this.props.sortNum * MAX_LOAD;
    var nload = this.props.routes.slice(this.offset, this.offset + INITIAL_LOAD);
    this.props.onload(nload);
    this.setState({
      loadedRoutes : nload,
      lq : this.props.query
    });
  }

  addItem(item) {
    this.items = [...this.items, item];
  }

  loadMore() {
    if(this.state.loadedRoutes.length === this.props.routes.length || this.state.loadedRoutes.length >= MAX_LOAD) {
      return;
    }
    var elm = document.getElementById('Result');
    var nload = this.props.routes.slice(this.offset, this.offset + this.state.loadedRoutes.length + ADD_PER_LOAD)
    this.props.onload(nload);
    this.setState({
      loadedRoutes : nload
    });
  }

  componentWillMount() {
    this.reloadRoutes();
  }

  render() {
    this.reloadRoutes();
    var rval = (
      <div id="resultlistcontainer">
          {
            this.state.loadedRoutes
              .map((rt, i) => <ResultListItem route={rt} onselect={(rt) => {if(this.props.onselect) this.props.onselect(i);}} query={this.props.query.startAddress} ref={q => {this.addItem(q)}}/>)
          }
          <div className="resultlistloadmore" onClick={this.loadMore}>
            Load More
          </div>
          <div className="resultlistspacer"/>
      </div>
    );
    return rval;
  }
}
