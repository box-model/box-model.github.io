import React, { Component } from 'react';
import SampleControl from './SampleControl';
import Sample from './Sample';
import Delayed from 'react-delayed';

export default class Samples extends Component {
  constructor(props) {
    super(props);

    this.state = {
      split: true,
      shouldRender: true,
      samplesRender: [],
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.samples.length === 0) {
      // console.log("gone");
      this.setState({ shouldRender: false });
    } else {
      // console.log("new");
      this.setState({ shouldRender: true, samplesRender: nextProps.samples });
    }
  }

  listSamples() {
    return this.state.samplesRender.map((value, index) => {
      return (
        <Sample
          shift={index}
          value={value}
          key={index}
          shouldRender={this.state.shouldRender}
          animationTime={this.props.animationTime}
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
            unmountAfter={1500}
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
