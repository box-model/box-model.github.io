import React, { Component } from 'react';
import { MAX_TIME, APPLICATION_STEP } from '../utils/Constants';

export default class Repeat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      times: 10,
      toggle: false
    };
    this.handleRepeatInput = this.handleRepeatInput.bind(this);
  }

  handleRepeatInput() {
    const times = parseInt(this.state.times);
    if (isNaN(times)) {
      this.props.handleAlert('Please enter correct number of times to repeat');
      return;
    }
    const timePerDraw =
      MAX_TIME *
      ((Math.log10(times) + 1) / times) *
      ((Math.log10(this.props.amount) + 1) / this.props.amount);

    this.props.setAnimationTime(timePerDraw);
    this.props.handleRepeat(false, times);
    // }
  }

  render() {
    return (
      <div
        className={`repeat overflow-check ${
          this.props.step >= APPLICATION_STEP.REPEAT ? 'fade-show' : 'fade-hidden'
        } `}
      >
        <div
          className={`repeat-panel overflow-check ${
            this.state.toggle ? 'slide-show' : 'slide-hidden'
          }`}
        >
          <button
            onClick={() => {
              this.setState(prevState => {
                return { toggle: !prevState.toggle };
              });
            }}
            type="btn"
            className={`btn btn-success btn-stretch btn-repeat`}
            value="repeat"
          >
            <span>
              <i className="fa fa-refresh" aria-hidden="true" />
            </span>
            <br />
            R<br />E<br />P<br />E<br />A<br />T
          </button>
          <div className={`input-group repeat-input`}>
            Repeat the entire sampling process (draw {this.props.amount} tickets
            and calculate their {this.props.aggregate})&nbsp;
            <input
              className="underline repeat-input-box"
              name="times"
              type="text"
              id="repeat-input"
              placeholder="Number"
              style={{
                width: `${
                  this.state.times != 0
                    ? Math.min(this.state.times.toString().length * 10, 80)
                    : 60
                }px`
              }}
              maxLength="4"
              value={this.state.times}
              onChange={e => {
                this.setState({ times: e.target.value });
              }}
            />{' '}
            times.
            <button
              type="button"
              className={`btn btn-dark text-light  stretch mt-3 mr-3`}
              onClick={this.handleRepeatInput}
              disabled={this.props.lock}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }
}
