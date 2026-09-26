import React, { Component } from 'react';
import Sample from './Sample';
import Delayed from 'react-delayed';

export default class Samples extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldRender: true,
      samplesRender: [],
      originsRender: [],
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.samples.length === 0) {
      // Keep the last sample rendered so its tickets can fly out.
      this.setState({ shouldRender: false });
    } else {
      this.setState({
        shouldRender: true,
        samplesRender: nextProps.samples,
        originsRender: nextProps.origins
      });
    }
  }

  // Departing tickets fly down to the statistics box in the same time
  // it takes to draw one ticket, so the whole process runs at one speed.
  leaveTime() {
    return this.props.animationTime;
  }

  listSamples() {
    return this.state.samplesRender.map((value, index) => {
      return (
        <Sample
          shift={index}
          value={value}
          origin={this.state.originsRender[index]}
          key={index}
          shouldRender={this.state.shouldRender}
          animationTime={this.props.animationTime}
          leaveTime={this.leaveTime()}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <div className="box row">
          <div className="background-tag">Sample</div>
          <Delayed
            mounted={this.state.shouldRender}
            mountAfter={0}
            unmountAfter={this.leaveTime()}
          >
            <div className="content">
              <div
                className={`wrapper ${
                  this.state.visible && !this.props.lock
                    ? 'wrapper-visible'
                    : 'wrapper-hidden'
                }`}
                onMouseEnter={e => {
                  return this.setState({ visible: true });
                }}
                onMouseLeave={e => this.setState({ visible: false })}
              >
                {this.listSamples()}
              </div>
            </div>
          </Delayed>
        </div>
      </div>
    );
  }
}
