import React, { Component } from 'react';
import { SPEED_MIN, SPEED_MAX } from '../utils/Constants';

export default class SpeedControl extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
  }

  // Tell the app while the thumb is held down: the browser keeps the thumb
  // under the pointer during a drag, so the app must not move it until the
  // pointer is released (which can happen anywhere on the page).
  handlePress() {
    this.props.onSliderActive(true);
    window.addEventListener('mouseup', this.handleRelease);
    window.addEventListener('touchend', this.handleRelease);
  }

  handleRelease() {
    window.removeEventListener('mouseup', this.handleRelease);
    window.removeEventListener('touchend', this.handleRelease);
    this.props.onSliderActive(false);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleRelease);
    window.removeEventListener('touchend', this.handleRelease);
  }

  render() {
    return (
      <div className="speed-control">
        <div className="speed-label">Speed</div>
        <div className="d-flex align-items-center">
          <i
            className="fa fa-clock-o"
            aria-hidden="true"
            title="One ticket per second"
          />
          <input
            type="range"
            className="custom-range mx-2"
            id="speed"
            min={SPEED_MIN}
            max={SPEED_MAX}
            step="1"
            value={this.props.speed}
            onChange={this.props.onSpeedChange}
            onMouseDown={this.handlePress}
            onTouchStart={this.handlePress}
            aria-label="Animation speed"
          />
          <i className="fa fa-bolt" aria-hidden="true" title="Instantaneous" />
        </div>
      </div>
    );
  }
}
