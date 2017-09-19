import React, { Component } from 'react';
import image_zoomIn from '../img/zoomIn.png';

let MULTIPLIER = 1.05;

export default class ZoomInButton extends Component {

  /*
   * @param {function} MapZoomChange
   */
  constructor(props) {
    super(props);
    this.handleZoomInClick = this.handleZoomInClick.bind(this);
  }

  /*
   * @param e - Event
   */
  handleZoomInClick(e) {
    this.props.MapZoomChange(MULTIPLIER);
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return (
      <img id='zoomIn' src={image_zoomIn}
        width='60' height='60'
        onClick={this.handleZoomInClick}
        style= {{
          left: 30 + 'px',
          top: 38 + 'px',
          position: 'absolute',
          pointerEvents: 'auto'
        }}
        alt=''
      />
    );
  }
}
