import React, { Component } from 'react';
import {APPLICATION_STEP} from '../utils/Constants'

export default class Bar extends Component {
  render() {
    let width = 11;
    if (this.props.step === APPLICATION_STEP.AGGREGATE) {
      width = 37;
    } else if (this.props.step === APPLICATION_STEP.REPEAT) {
      width = 62;
    } else if (this.props.step === APPLICATION_STEP.ANALYZE) {
      width = 87;
    } else if (this.props.step === APPLICATION_STEP.DONE) {
      width = 100;
    }

    return (
      <div>
        <div className="row no-gutters my-0 mx-3">
          <div className="col-12">
            <div className="progress" style={{ height: '5px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${width}%`, transition: 'all .7s ease-out' }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-3 mx-3">
          <div className="col-3">
            <p
              className={`${
                this.props.step == APPLICATION_STEP.SAMPLE ? 'highlight' : ''
              } text-center`}
            >
              Sample &emsp;
              <span>
                <i className="fa fa-hand-paper-o" aria-hidden="true" />
              </span>
            </p>
          </div>
          <div className="col-3">
            <p
              className={`${
                this.props.step == APPLICATION_STEP.AGGREGATE ? 'highlight' : ''
              } text-center`}
            >
              Aggregate&emsp;<span>
                <i className="fa fa-calculator" aria-hidden="true" />
              </span>
            </p>
          </div>
          <div className="col-3">
            <p
              className={`${
                this.props.step == APPLICATION_STEP.REPEAT ? 'highlight' : ''
              } text-center`}
            >
              Repeat&emsp;<span>
                <i className="fa fa-refresh" aria-hidden="true" />
              </span>
            </p>
          </div>
          <div className="col-3">
            <p
              className={`${
                this.props.step == APPLICATION_STEP.ANALYZE ? 'highlight' : ''
              } text-center`}
            >
              Analyze&emsp;<span>
                <i className="fa fa-bar-chart" aria-hidden="true" />
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
