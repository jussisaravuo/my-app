import React, { Component } from 'react';
import image_map from '../img/map.png';

export let MAP_IMAGE_WIDTH = 2579;
export let MAP_IMAGE_HEIGHT = 1838;

export default class MapImage extends Component {

  /*
   *  @param {function} mapPositionChange
   *  @param {Number} left
   *  @param {Number} top
   *  @param {Number} width
   *  @param {Number} height
   */
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.handleEventsOfMapContent = this.handleEventsOfMapContent.bind(this);
    this.updateMapPosition = this.updateMapPosition.bind(this);

    this.dragging = false;
    this.savedValues = false;
  }

  /*
   * @param e - Event
   */
  handleMouseDown(e) {
    this.handleEventsOfMapContent(e, 'down');
  }

  /*
   * @param e - Event
   */
  handleMouseUp(e) {
    this.handleEventsOfMapContent(e, 'up');
  }

  /*
   * @param e - Event
   */
  handleMouseOut(e) {
    this.handleEventsOfMapContent(e, 'out');
  }

  /*
   * @param e - Event
   */
  handleMouseLeave(e) {
    this.handleEventsOfMapContent(e, 'leave');
  }

  /*
   * @param e - Event
   */
  handleMouseMove(e) {
    this.handleEventsOfMapContent(e, 'move');
  }

  /*
   *  Handle events of map-content.
   *  @param e - Event
   *  @param {String} eventType - down | move | up | out | leave
   *
   */
  handleEventsOfMapContent(e, eventType) {
    if (eventType === 'move') {
      if (this.dragging) {
        let xNew = Math.round(this.savedValues.map.x + e.clientX - this.savedValues.pointer.x);
        let yNew = Math.round(this.savedValues.map.y + e.clientY - this.savedValues.pointer.y);
        this.updateMapPosition(xNew, yNew);
      }
    }
    else if (eventType === 'down') {
      this.dragging = false;
      this.savedValues = {
        pointer: {x: e.clientX, y: e.clientY},
        map: {x: this.props.left, y: this.props.top}
      };
      this.dragging = true;
    }
    else if (this.dragging && (eventType === 'up' || eventType === 'out' || eventType === 'leave')) {
      this.dragging = false;
    }
    e.stopPropagation();
    e.preventDefault();
  }

  /*
   *  Update new position for mapImageHolder.
   *  @param {Number} x - Position x.
   *  @param {Number} y - Position y.
   */
  updateMapPosition(x, y) {
    this.props.mapPositionChange(x, y);
  }

  render() {
    let left = this.props.left;
    let top = this.props.top;
    let width = this.props.width;
    let height = this.props.height;
    return (
      <img id = 'map-image'
        src = {image_map}
        width = {width} 
        height = {height} 
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseOut={this.handleMouseOut}
        onMouseLeave={this.handleMouseLeave}
        style = {{
          left: left + 'px',
          top: top + 'px',
          position: 'absolute',
          pointerEvents: 'auto'
        }}
        alt=''
      />
    );
  }
}
