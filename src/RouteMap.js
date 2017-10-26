
import React, { Component } from 'react';

const PATH_COLOR_NORMAL = '#000000';
const PATH_COLOR_SELECTED = '#00FF00';
const START_BORDER_COLOR_NORMAL = '#FFD700';
const START_BORDER_COLOR_SELECTED = '#FFDD00';
const START_FILL_COLOR_NORMAL = '#00FF00';
const START_FILL_COLOR_SELECTED = '#00FF00';
const STATION_BORDER_COLOR_NORMAL = '#00F0F0';
const STATION_BORDER_COLOR_SELECTED = '#880000';
const DEST_BORDER_COLOR_NORMAL = '#FF0000';
const DEST_BORDER_COLOR_SELECTED = '#0000FF';
const DEST_FILL_COLOR_NORMAL = '#FF0000';
const DEST_FILL_COLOR_SELECTED = '#0000FF';

const DEFAULT_ZOOM = 14;
const DEFAULT_POS = {lat : 41, lng: -74};

var google = window.google;

export default class RouteMap extends Component {

  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.recalculateZoom = this.recalculateZoom.bind(this);
    this.lines = [];
    this.circles = [];
    this.center = {
      latitude : 0,
      longitude : 0
    }
    this.loadJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyB0pBdXuC4VRte73qnVtE5pLmxNs3ju0Gg&callback=initMap");
  }

  componentDidMount () {
    window.initMap = this.initMap;
  }

  avgLatLng(routes) {
    var tcount = routes
      .map(rt => rt.route).reduce((x, y) => x.concat(y), [])
      .length;
    var sumpos = routes
      .map(rt => rt.route).reduce((x, y) => x.concat(y), [])
      .map(nd => nd.pt)
      .map((item) => item[Object.keys(item)[0]])
      .filter((item) => item !== undefined)
      .reduce((itm1, itm2) => {return {latitude : itm1.latitude + itm2.latitude, longitude: itm1.longitude + itm2.longitude}}, {latitude: 0, longitude:0});
    return {latitude : sumpos.latitude / tcount, longitude : sumpos.longitude / tcount};
  }

  routeToPath(route) {
    return route.route
      .map(nd => nd.pt)
      .map(item => item[Object.keys(item)[0]])
      .map(item => {return {lat : item.latitude, lng : item.longitude}});
  }

  buildRoutePolyline(route, selected) {
    var color = !selected ? PATH_COLOR_NORMAL :  PATH_COLOR_SELECTED;
    return new google.maps.Polyline({
      path : this.routeToPath(route),
      geodesic : false,
      strokeColor : color,
      strokeOpacity : 1.0,
      strokeWeight : 2 * Math.pow(1.3, this.map.getZoom() - 13),
      zIndex : selected ? 0 : -1
    });
  }

  buildStationCircles(route, selected) {
    var path = route.route
      .map(nd => nd.pt)
      .map(item => item[Object.keys(item)[0]])
      .map(item => {return {lat : item.latitude, lng : item.longitude}});
    var startCircle = new google.maps.Circle({
      strokeColor : selected ? START_BORDER_COLOR_SELECTED : START_BORDER_COLOR_NORMAL,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: selected ? START_FILL_COLOR_SELECTED : START_FILL_COLOR_NORMAL,
      fillOpacity: 1,
      center: path[0],
      zIndex: 20,
      radius: 60 * Math.pow(1.5, 13 - this.map.getZoom())
    });
    var destCircle = new google.maps.Circle({
      strokeColor : selected ? DEST_BORDER_COLOR_SELECTED : DEST_BORDER_COLOR_NORMAL,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: selected ? DEST_FILL_COLOR_SELECTED : DEST_FILL_COLOR_NORMAL,
      fillOpacity: 1,
      center: path[path.length -1],
      zIndex: selected ? 2 : 1,
      radius: 60 * Math.pow(1.5, 13 - this.map.getZoom())
    });
    var rest = path.slice(1, path.length -1)
      .map(pt => new google.maps.Circle({
        strokeColor : selected ? STATION_BORDER_COLOR_SELECTED : STATION_BORDER_COLOR_NORMAL,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        center: pt,
        zIndex: selected ? 2 : 1,
        radius: 60 * Math.pow(1.5, 13 - this.map.getZoom())
      }));
      return [startCircle, ...rest, destCircle];
  }

  initMap() {
    google = window.google;
    this.map = new google.maps.Map(document.getElementById('mapframe'),{
      zoom : DEFAULT_ZOOM,
      center : DEFAULT_POS,
      mapTypeId : 'terrain',

    });
    google.maps.event.addListener(this.map, 'zoom_changed', this.recalculateZoom);
    this.updateMap();
  }

  recalculateZoom() {
    const circlerad = 60 * Math.pow(1.5, 13 - this.map.getZoom());
    const pathweight = 2 * Math.pow(1.3, this.map.getZoom() - 13);
    this.lines.forEach(l => l.setOptions({strokeWeight : pathweight}))
    this.circles.forEach(c => c.setOptions({radius : circlerad}))
  }

  updateMap() {
    this.lines.forEach(l => l.setMap(null))
    this.lines = [];
    this.circles.forEach(c => c.setMap(null))

    if( !this.props.routes || this.props.routes.length == 0) {
      this.map.panTo(DEFAULT_POS);
      this.center = DEFAULT_POS;
      return;
    }

    var avgpos = this.avgLatLng(this.props.routes);
    if(this.center.latitude !== avgpos.latitude && this.center.longitude !== avgpos.longitude) {
      this.map.panTo({lat : avgpos.latitude, lng : avgpos.longitude});
      this.map.setZoom(DEFAULT_ZOOM);
      this.center = avgpos;
    }

    for(var i = 0; i < this.props.routes.length; i++) {
      var line = this.buildRoutePolyline(this.props.routes[i], i === this.props.selected);
      line.setMap(this.map);
      this.lines.push(line);
      var circles = this.buildStationCircles(this.props.routes[i], i=== this.props.selected);
      circles.forEach(c => {
        c.setMap(this.map);
        this.circles.push(c);
      });
    }
  }

  loadJS(src) {
      var ref = window.document.getElementsByTagName("script")[0];
      var script = window.document.createElement("script");
      script.src = src;
      script.async = true;
      ref.parentNode.insertBefore(script, ref);
  }

  render() {
    if(this.map) this.updateMap();
    return <div id = "mapframe"></div>;
  }
}
