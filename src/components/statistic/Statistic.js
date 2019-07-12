import React, { Component } from 'react';

export default class Statistic extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={`row`}>
          <div className="col-12 box box-statistic">
            <div className="background-tag">Statistics</div>
            {this.props.stats.map((e, i) => (
              <div className="stats-item text-right" key={i}>
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
