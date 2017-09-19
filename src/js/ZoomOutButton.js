import React, { Component } from 'react';
import image_zoomOut from '../img/zoomOut.png';

let MULTIPLIER = 0.95;

export default class ZoomOutButton extends Component {

  /*
   * @param {function} MapZoomChange
   */
  constructor(props) {
    super(props);
    this.handleZoomOutClick = this.handleZoomOutClick.bind(this);
  }

  /*
   * @param e - Event
   */
  handleZoomOutClick(e) {
    this.props.MapZoomChange(MULTIPLIER);
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return (
      <img id='zoomOut' src={image_zoomOut}
        width='60' height='60'
        onClick={this.handleZoomOutClick}
        style= {{
          left: 30 + 'px',
          top: 104 + 'px',
          position: 'absolute',
          pointerEvents: 'auto'
        }}
        alt=''
      />
    );
  }
}