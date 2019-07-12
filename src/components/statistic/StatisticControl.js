import React, { Component } from 'react';
import {APPLICATION_STEP, AGGREGATION_MODE} from '../../utils/Constants';

function StatsControl(props) {
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
          <form className="form-inline float-right pt-1">
            Calculate the
            <select
              disabled={props.lock}
              className={`form-control select-border mx-2 ${
                props.step >= APPLICATION_STEP.REPEAT ? 'input-highlighter-color' : ''
              }`}
              onChange={e => {
                props.handleChangeAggregate(e.target.value);
              }}
            >
              <option value={AGGREGATION_MODE.SUM}>sum</option>
              <option value={AGGREGATION_MODE.MEAN}>mean</option>
            </select>
            of the tickets in the sample.
          </form>
        </div>
        <div className="col-2">
          <button
            type="button"
            className={`btn btn-success btn-large mx-2 my-1`}
            disabled={props.lock || props.isSampleEmpty}
            onClick={() => {
              props.handleAggregate(props.aggregate);
            }}
          >
            Aggregate <i className="fa fa-calculator" aria-hidden="true" />
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
export default StatsControl;
