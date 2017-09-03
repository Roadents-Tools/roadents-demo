import React, {Component} from 'react';
import ResultListItem from './ResultListItem.js';

const ADD_PER_LOAD = 10;
const INITIAL_LOAD = 10;

export default class ResultList extends Component{

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);

    this.state = {
      loadedItems : this.props.routes.slice(0, INITIAL_LOAD)
    };
  }

  loadMore() {
    if(this.state.loadedItems.length === this.props.routes.length) {
      return;
    }
    var elm = document.getElementById('Result');
    elm.scrollTop=0;
    this.setState({
      loadedItems : this.props.routes.slice(0, this.state.loadedItems.length + ADD_PER_LOAD)
    });
    console.log("Loading");
  }

  render() {
    this.props.routes.sort(this.props.sort);
    return (
      <div id="resultlistcontainer">
          {this.state.loadedItems
            .map(rt => <ResultListItem route={rt} query={this.props.query} />)}
          <div className="resultlistloadmore" onClick={this.loadMore}>
            Load More
          </div>
          <div className="resultlistspacer"/>
      </div>
    )
  }
}
