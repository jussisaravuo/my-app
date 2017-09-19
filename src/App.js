import React, { Component } from 'react';
import ZoomInButton from './js/ZoomInButton';
import ZoomOutButton from './js/ZoomOutButton';
import ZoomButtonsBg from './js/ZoomButtonsBg';
import MapImage, { MAP_IMAGE_WIDTH, MAP_IMAGE_HEIGHT} from './js/MapImage';

import './App.css';

/*
 * @param {left, top, width, height} mapHolder
 *
 * @return {left, top, width, height} Returns the centralized {left, top, width, height}-values.
 */
function getCentralizedMapImageValues(mapHolder) {
  if (MAP_IMAGE_WIDTH / MAP_IMAGE_HEIGHT < mapHolder.width / mapHolder.height) {
    let mapImageHeight = (mapHolder.width / MAP_IMAGE_WIDTH) * MAP_IMAGE_HEIGHT;
    return {
      left: 0, 
      top: parseInt((mapHolder.height - mapImageHeight) / 2, 10), 
      width: mapHolder.width, 
      height: mapImageHeight, 
      multiplier: mapHolder.width / MAP_IMAGE_WIDTH
    };
  }
  else {
    let mapImageWidth = parseInt(mapHolder.height / MAP_IMAGE_HEIGHT * MAP_IMAGE_WIDTH, 10);
    return {
      left: parseInt((mapHolder.width - mapImageWidth) / 2, 10), 
      top: 0, 
      width: mapImageWidth, 
      height: mapHolder.height, 
      multiplier: parseFloat((mapHolder.height / MAP_IMAGE_HEIGHT).toFixed(2))
    };
  }
}

class App extends Component {

  /*
   * @param props
   */
  constructor(props) {
    super(props);

    this.handleMapZoomChange = this.handleMapZoomChange.bind(this);
    this.handleMapPositionChange = this.handleMapPositionChange.bind(this);
    this.resize = this.resize.bind(this);

    window.addEventListener('resize', this.resize);

    // Zoom and centralize image.
    let mapHolder = {
      left: 10, 
      top: 10, 
      width: window.innerWidth - 20, 
      height: window.innerHeight - 20
    };

    this.state = {
      mapHolder,
      mapImage: getCentralizedMapImageValues(mapHolder)
    };
  }

  /*
   * @param {Number} x - Position x.
   * @param {Number} y - Position y.
   */
  handleMapPositionChange(x, y) {

    // Restrict (x,y)-position of mapImageHolder so that it's edges won't arrive into the visible-area.
    let limits = {
      max: {x: 0, y: 0},
      min: {
        x: parseInt(this.state.mapHolder.width, 10) - parseInt(this.state.mapImage.width, 10),
        y: parseInt(this.state.mapHolder.height, 10) - parseInt(this.state.mapImage.height, 10)
      }
    };

    if (x > limits.max.x) {
      x = limits.max.x;
    } else if (x < limits.min.x) {
      x = limits.min.x;
    }
    if (y > limits.max.y) {
      y = limits.max.y;
    } else if (y < limits.min.y) {
      y = limits.min.y;
    }

    this.setState({
      mapImage:{
        left: x,
        top: y,
        width: this.state.mapImage.width,
        height: this.state.mapImage.height,
        multiplier:this.state.mapImage.multiplier
      }
    });
  }

  /*
   * @param {Number} multiplier - If multiplier is +1 it mean zoom in. If multiplier is -1 it mean zoom out.
   */
  handleMapZoomChange(multiplier) {
    //console.log('handleMapZoomChange('+multiplier+')');

    let mapImage = this.state.mapImage;
    let mapHolder = this.state.mapHolder;

    // Calculate the center of mapHolder.
    let center = {x: mapHolder.width / 2, y: mapHolder.height / 2};

    // Calculate mapImageHolder's percentual offset from the center of mapHolder.
    let procentualOffsetX = (center.x - mapImage.left) / mapImage.width;
    let procentualOffsetY = (center.y - mapImage.top) / mapImage.height;

    // Calculate new zoom-value.
    let multiplier_new = parseFloat((mapImage.multiplier * multiplier).toFixed(2));

    let width_new = parseInt(multiplier_new * MAP_IMAGE_WIDTH, 10);
    let height_new = parseInt(multiplier_new * MAP_IMAGE_HEIGHT, 10);

    // Make sure that the size of mapImage will fill the visible-area.
    let left_new;
    let top_new;
    let fit;
    if (width_new < mapHolder.width && height_new < mapHolder.height) {
      fit = (width_new / mapHolder.width < height_new / mapHolder.height ? 'width' : 'height');
    }
    else if (width_new < mapHolder.width && height_new >= mapHolder.height) {
      fit = 'width';
    }
    else if (height_new < mapHolder.height && width_new >= mapHolder.width) {
      fit = 'height';
    }

    if (fit === 'width') {
      width_new = mapHolder.width;
      height_new = parseInt((MAP_IMAGE_HEIGHT / MAP_IMAGE_WIDTH) * mapHolder.width, 10);
      multiplier_new = parseFloat((width_new / MAP_IMAGE_WIDTH).toFixed(2));
      left_new = 0;
      top_new = parseInt(center.y - procentualOffsetY * height_new, 10);
    }
    else if (fit === 'height') {
      height_new = mapHolder.height;
      width_new = parseInt((MAP_IMAGE_WIDTH / MAP_IMAGE_HEIGHT) * mapHolder.height, 10);
      multiplier_new = parseFloat((height_new / MAP_IMAGE_HEIGHT).toFixed(2));
      left_new = parseInt(center.x - procentualOffsetX * width_new, 10);
      top_new = 0;
    }
    else {
      left_new = parseInt(center.x - procentualOffsetX * width_new, 10);
      top_new = parseInt(center.y - procentualOffsetY * height_new, 10);
    }

    // Restrict (x,y)-position of mapImageHolder so that it's edges won't arrive into the visible-area.
    if (left_new > 0) {
      left_new = 0;
    } else if (left_new < mapHolder.width - width_new) {
      left_new = mapHolder.width - width_new;
    }
    if (top_new > 0) {
      top_new = 0;
    } else if (top_new < mapHolder.height - height_new) {
      top_new = mapHolder.height - height_new;
    }

    // Update the new position and size for mapImage.
    this.setState({
      mapImage:{
        left: left_new,
        top: top_new,
        width: width_new,
        height: height_new,
        multiplier:multiplier_new
      }
    });
  }

  /*
   *  Resize.
   */
  resize() {
    // update mapHolder.
    let width = window.innerWidth - 20;
    let height = window.innerHeight - 20;
    this.setState({mapHolder:{
      left: this.state.mapHolder.left,
      top: this.state.mapHolder.top,
      width: width,
      height: height
    }});

    // Make sure that map will fill the whole map-view area.
    this.handleMapZoomChange(1);
  }

  render() {
    let mapImage = this.state.mapImage;
    let mapHolder = this.state.mapHolder;

    let mapHolderStyle = {
      left: mapHolder.left+'px',
      top: mapHolder.top+'px',
      width: mapHolder.width+'px',
      height: mapHolder.height + 'px',
      position: 'absolute',
      padding: `0px 0px 0px 0px`,
      overflow: 'hidden',
      backgroundColor: 'rgba(255,0,0,0.5)',
      pointerEvents: 'auto'
    };

    return (
      <div>
        <div id='map-holder' style={mapHolderStyle}> 
          <MapImage left={mapImage.left} top={mapImage.top} width={mapImage.width} height={mapImage.height} mapPositionChange={this.handleMapPositionChange}/>
        </div>
        <ZoomButtonsBg />
        <ZoomInButton MapZoomChange={this.handleMapZoomChange} />
        <ZoomOutButton MapZoomChange={this.handleMapZoomChange} />
      </div>
    );
  }
}

export default App;
