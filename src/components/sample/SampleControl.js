import React, { Component } from 'react';
import { MAX_DRAW_TIME, APPLICATION_STEP } from '../../utils/Constants';

export default class SampleControl extends Component {
  constructor(props) {
    super(props);

    this.handleSample = this.handleSample.bind(this);
  }

  handleSample() {
    const timePerDraw =
      (MAX_DRAW_TIME * (Math.log10(this.props.amount) + 1)) / this.props.amount;
    this.props.setAnimationTime(timePerDraw);
    this.props.handleSampleTicket(this.props.mode, parseInt(this.props.amount));
  }

  render() {
    return (
      <div>
        <div className="row no-gutters m-0 p-0">
          <div className="col-5" />
          <div className="col-6">
            <i
              className="fa fa-caret-down arrow-down"
              style={{ fontSize: '72px', lineHeight: '0' }}
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="row no-gutters m-0 p-0">
          <div className="col-8">
            <form className="form-inline float-right mt-1">
              Randomly draw
              <div className="input-group mx-2">
                <input
                  name="sample-amount"
                  type="text"
                  className={`form-control underline ${
                    this.props.step >= APPLICATION_STEP.REPEAT ? 'input-highlighter-color' : ''
                  }`}
                  id="input-amount"
                  placeholder="Amount"
                  value={this.props.amount}
                  style={{
                    width: `${
                      this.props.amount != 0
                        ? Math.min(this.props.amount.toString().length * 10, 80)
                        : 60
                    }px`
                  }}
                  maxLength="8"
                  onChange={this.props.OnAmountChange}
                  disabled={this.props.lock}
                />
              </div>
              <label htmlFor="sample-mode">tickets</label>
              <select
                className={`form-control ml-2 select-border ${
                  this.props.step >= APPLICATION_STEP.REPEAT ? 'input-highlighter-color' : ''
                }`}
                name="sample-mode"
                id="sample-mode"
                value={this.props.mode}
                onChange={this.props.OnModeChange}
                disabled={this.props.lock}
              >
                <option value="WITH">with replacement</option>
                <option value="WITHOUT">without replacement</option>
              </select>.
            </form>
          </div>
          <div className="col-2 mr-auto">
            <button
              type="button"
              className={`btn btn-success btn-large ml-1 my-1`}
              onClick={this.handleSample}
              disabled={this.props.lock}
            >
              Sample <i className="fa fa-hand-paper-o" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="row no-gutters m-0 p-0">
          <div className="col-5" />
          <div className="col-6">
            <i
              className="fa fa-caret-down arrow-down"
              style={{ fontSize: '72px', lineHeight: '0' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }
}
