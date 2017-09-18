import React, { Component } from 'react';
import image_zoomBg from '../img/zoomBg.png';

export default class ZoomButtonsBg extends Component {

  render() {
    let scale = 0.5;
    let width = scale * 200;
    let height = scale * 380;
    return (
      <img id='zoomBg' src={image_zoomBg}
        width={width}
        height={height}
        onClick={this.handleZoomInClick}
        style= {{
          left: 11 + 'px',
          top: 8 + 'px',
          position: 'absolute',
          pointerEvents: 'auto'
        }}
        alt=''
      />
    );
  }
}
