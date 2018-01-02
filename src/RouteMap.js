
import React, { Component } from 'react';

const PATH_COLOR_NORMAL = '#828483';
const PATH_COLOR_SELECTED = '#76a8d7';
const PATH_COLOR_TRANSIT_NORMAL = '#828483';
const PATH_COLOR_TRANSIT_SELECTED = '#76a8d7';

const START_BORDER_COLOR_NORMAL = '#000000';
const START_BORDER_COLOR_SELECTED = '#000000';
const START_FILL_COLOR_NORMAL = '#FF0000';
const START_FILL_COLOR_SELECTED = '#FF0000';
const STATION_BORDER_COLOR_NORMAL = '#000000';
const STATION_BORDER_COLOR_SELECTED = '#000000';
const DEST_BORDER_COLOR_NORMAL = '#000000';
const DEST_BORDER_COLOR_SELECTED = '#000000';
const DEST_FILL_COLOR_NORMAL = '#00FF00';
const DEST_FILL_COLOR_SELECTED = '#0066FF';

const DEFAULT_ZOOM = 14;
const DEFAULT_POS = {lat : 41, lng: -74};

const LINE_WEIGHT = 3;
const DASH_SPACE = 2;
const DASH_SCALE = 0.25;
const RADIUS_SCALE = 45;

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
      .map(nd => {return {pt : nd.pt, walk : nd.walkTimeFromPrev > 0}})
      .map(item => {return {
        lat : item.pt[Object.keys(item.pt)[0]].latitude,
        lng : item.pt[Object.keys(item.pt)[0]].longitude,
        walk : item.walk
       }})
  }

  buildRoutePolyline(route, selected) {
    var rt = this.routeToPath(route);
    var rval = [];
    const pathweight = this.getWalkingWeight(this.map.getZoom());
    for(var i = 1; i < rt.length; i++) {
      var path = [rt[i], rt[i-1]];
      if(!rt[i].walk) {
        var topush = new google.maps.Polyline({
          path : path,
          geodesic : false,
          strokeColor : selected ? PATH_COLOR_SELECTED : PATH_COLOR_NORMAL,
          strokeOpacity : 1.0,
          strokeWeight : pathweight,
          zIndex : selected ? 0 : -1
        });
        topush.selected = selected;
        topush.walk = true;
        rval.push(topush);
      }
      else {
        var topush = new google.maps.Polyline({
          path : path,
          geodesic : false,
          strokeOpacity : 0,
          zIndex : selected ? 0 : -1,
          icons : [{
            icon : {
              path : `M 0,${-1 * DASH_SCALE} 0,${DASH_SCALE}`,
              strokeColor : selected ? PATH_COLOR_TRANSIT_SELECTED : PATH_COLOR_TRANSIT_NORMAL,
              strokeOpacity : 1.0,
              strokeWeight : pathweight
            },
            offset : '0',
            repeat : (DASH_SPACE * pathweight) + 'px'
          }]
        })
        topush.selected = selected;
        topush.walk = false;
        rval.push(topush);
      }
    }
    return rval;
  }

  buildStationCircles(route, selected) {
    var path = route.route
      .map(nd => nd.pt)
      .map(item => item[Object.keys(item)[0]])
      .map(item => {return {lat : item.latitude, lng : item.longitude}});
    /*var startCircle = new google.maps.Circle({
      strokeColor : selected ? START_BORDER_COLOR_SELECTED : START_BORDER_COLOR_NORMAL,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: selected ? START_FILL_COLOR_SELECTED : START_FILL_COLOR_NORMAL,
      fillOpacity: 1,
      center: path[0],
      zIndex: 20,
      radius: this.getCircleRad(this.map.getZoom())
    });*/
    var endpt = route.dest.name;
    var endMarker = new google.maps.Marker({
      position: path[path.length - 1],
      icon: {
        scaledSize : {
          width : 20 * this.getMarkerScale(this.map.getZoom()),
          height : 34 * this.getMarkerScale(this.map.getZoom())
        },
        url : "http://maps.gstatic.com/mapfiles/markers2/markerB.png"
      },
      map : null,
      scale : this.getMarkerScale(this.map.getZoom()),
      title : endpt
    });
    endMarker.ttp = "mk";
    console.log(`End marker at ${JSON.stringify(endMarker.position)}`);

    var startMarker = new google.maps.Marker({
      position: path[0],
      map : null,
      icon: {
        scaledSize : {
          width : 20 * this.getMarkerScale(this.map.getZoom()),
          height : 34 * this.getMarkerScale(this.map.getZoom())
        },
        url : "http://maps.gstatic.com/mapfiles/markers2/marker_greenA.png"
      }
    });
    startMarker.ttp = "mk";
    console.log(`Start marker at ${JSON.stringify(startMarker.position)} with ${startMarker.ttp}`);
    /*var destCircle = new google.maps.Circle({
      strokeColor : selected ? DEST_BORDER_COLOR_SELECTED : DEST_BORDER_COLOR_NORMAL,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: selected ? DEST_FILL_COLOR_SELECTED : DEST_FILL_COLOR_NORMAL,
      fillOpacity: 1,
      center: path[path.length -1],
      zIndex: selected ? 2 : 1,
      radius: this.getCircleRad(this.map.getZoom())
    });*/
    var rest = path.slice(1, path.length -1)
      .map(pt => new google.maps.Circle({
        strokeColor : selected ? STATION_BORDER_COLOR_SELECTED : STATION_BORDER_COLOR_NORMAL,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        center: pt,
        zIndex: selected ? 2 : 1,
        radius: this.getCircleRad(this.map.getZoom())
      }));
    let rval = [startMarker, ...rest, endMarker]
    console.log(`Returning ${rval.length} circs and marks for route of size ${route.route.length}`);
      //return [startCircle, ...rest, destCircle];
    return rval
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
    console.log(`Map zoom level : ${this.map.getZoom()}`);
    const circlerad = this.getCircleRad(this.map.getZoom());
    const pathweight = this.getWalkingWeight(this.map.getZoom());
    const mkw = 20 * this.getMarkerScale(this.map.getZoom())
    const mkh = 34 * this.getMarkerScale(this.map.getZoom())
    console.log(`Marker dims: ${mkw} x ${mkh}`);
    this.lines.forEach(l => {
      if(l.walk) {
        l.setOptions({strokeWeight : pathweight})
      }
      else {
          var icons = [{
            icon : {
              path : `M 0,${-1 * DASH_SCALE} 0,${DASH_SCALE}`,
              strokeColor : PATH_COLOR_TRANSIT_NORMAL,
              strokeOpacity : 1.0,
              strokeWeight : pathweight
            },
            offset : '0',
            repeat : (DASH_SPACE * pathweight) + 'px'
          }];
          if(l.selected) {
            icons[0].icon.strokeColor = PATH_COLOR_TRANSIT_SELECTED;
          }
          console.log(icons[0].icon.strokeWeight);
          l.setOptions({icons : icons});
      }
    })
    this.circles.forEach(c => {
      if(c.ttp) {
        c.setIcon({
          url : c.getIcon().url,
          scaledSize : {
            width : mkw,
            height : mkh
          }
        })
      }
      else c.setOptions({radius : circlerad})
    })
  }
  getCircleRad(z) {
    return RADIUS_SCALE * Math.pow(1.5, 13 - z);
  }
  getWalkingWeight(z) {
    return LINE_WEIGHT * Math.pow(1.3, z - 13);
  }
  getMarkerScale(z) {
    return 1 * Math.pow(1.2, z - 14 )
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
      var linek = this.buildRoutePolyline(this.props.routes[i], i === this.props.selected);
      linek.forEach(line => {
        line.setMap(this.map);
        this.lines.push(line);
      });
      var circles = this.buildStationCircles(this.props.routes[i], i=== this.props.selected);
      circles.forEach(c => {
        console.log(`Got circle ${c}.`);
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
