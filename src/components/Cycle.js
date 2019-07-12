import React from "react";
import {APPLICATION_STEP} from '../utils/Constants'

const Cycle = props => {
  return (
    <div>
      {props.step >= APPLICATION_STEP.REPEAT ? <div className="highlighter highlighter-open" /> : ""}
      <div className="row pl-3 p-1">
        <div className="col-7">
          {props.template}
          {props.box}
        </div>
        <div className="col-1 pl-1 ml-0 mt-5">
          {props.boxControls} {props.boxChartInfo}
        </div>
        <div className="col-4">{props.boxHist}</div>
      </div>
      <div className="row pl-3 p-1">
        <div className="col-7">{props.samplesControls}</div>
        <div className="col-5" />
      </div>
      <div
        className={`row pl-3 p-1 ${
          props.step >= APPLICATION_STEP.AGGREGATE ? "fade-show" : "fade-hidden"
        }`}
      >
        <div className="col-7">{props.samples}</div>
        <div className="col-1 pl-1 ml-0">
          {props.sampleRecycle} {props.sampleChartInfo}
        </div>
        <div className="col-4">{props.samplesHist}</div>
      </div>
      <div
        className={`row pl-3 p-1  ${
          props.step >= APPLICATION_STEP.AGGREGATE ? "fade-show" : "fade-hidden"
        }`}
      >
        <div className="col-7">{props.statsControl}</div>
        <div className="col-5" />
      </div>
      <div
        className={`row pl-3 p-1 ${
          props.step >= APPLICATION_STEP.REPEAT ? "fade-show" : "fade-hidden"
        }`}
      >
        <div className="col-7">{props.stats}</div>
        <div className="col-1 pl-1 ml-0">
          {props.statsClear} {props.statsChartInfo}
        </div>
        <div className="col-4">{props.statsHist}</div>
      </div>
      <div
        className={`row pl-3 p-1  ${
          props.step >= APPLICATION_STEP.ANALYZE ? "fade-show" : "fade-hidden"
        }`}
      >
        <div className="col-7">{props.filterControl}</div>
      </div>
      <div
        className={`row pl-3 p-1  ${
          props.step >= APPLICATION_STEP.DONE ? "fade-show" : "fade-hidden"
        }`}
      >
        <div className="col-7">
          <h1 className="display-4 text-center">
            {props.count} out of {props.totalCount} ={" "}
            {(props.count / props.totalCount * 100).toFixed(1)} %
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Cycle;
