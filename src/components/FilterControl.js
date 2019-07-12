import React, { Component } from 'react';

export default class FilterControl extends Component {
  constructor(props) {
    super(props);
    this.calculateCount = this.calculateCount.bind(this);
  }

  calculateCount(e) {
    e.preventDefault();
    this.props.handleCount(this.props.filterValue, this.props.filterOperator);
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
            <form className="form-inline float-right pt-1">
              Count how many are
              <select
                name="filter-operator"
                value={this.props.filterOperator}
                className={`form-control select-border mx-1`}
                onChange={e => this.props.setFilterOperator(e.target.value)}
              >
                <option value="LT">&lt;</option>
                <option value="LE">&le;</option>
                <option value="GT">&gt;</option>
                <option value="GE">&ge;</option>
                <option value="EQ">=</option>
                <option value="NE">&ne;</option>
              </select>
              <div className="input-group mx-2">
                <input
                  name="filter-value"
                  type="text"
                  className={`form-control underline`}
                  id="filter-value"
                  placeholder="value"
                  value={this.props.filterValue}
                  onChange={e => this.props.setFilterValue(e.target.value)}
                  style={{
                    width: `${
                      this.props.filterValue != 0
                        ? Math.min(
                            this.props.filterValue.toString().length * 10,
                            80
                          )
                        : 60
                    }px`
                  }}
                />.
              </div>
            </form>
          </div>
          <div className="col-2">
            <button
              type="button"
              className={`btn btn-success btn-large mx-2 my-1`}
              onClick={this.calculateCount}
            >
              Analyze{' '}
              <span>
                <i className="fa fa-bar-chart" aria-hidden="true" />
              </span>
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
