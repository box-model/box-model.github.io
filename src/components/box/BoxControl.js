import React, { Component } from "react";

export default class BoxControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      amount: 1
    };
  }

  handleAddTicket(event) {
    if (
      isNaN(parseFloat(this.state.value)) ||
      parseFloat(this.state.amount) < 0
    ) {
      this.props.handleAlert("Please enter valid value ");
      return;
    }
    this.props.handleAddTicket({
      value: parseFloat(this.state.value),
      amount: parseFloat(this.state.amount)
    });
  }

  render() {
    return (
      <div className="box-control-menu">
        <div className="dropleft">
          <button
            type="button"
            className={`btn btn-primary`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            disabled={this.props.lock}
          >
            <i className="fa fa-plus" aria-hidden="true" />
          </button>
          <div className="dropdown-menu box-form">
            <form className="form-inline">
              <div className="ticket">
                <input
                  type="text"
                  className="form-control input-box"
                  id="input-value"
                  placeholder="Value"
                  value={this.state.value}
                  maxLength="5"
                  onChange={event =>
                    this.setState({ value: event.target.value })
                  }
                />
                <div className="top left" />
                <div className="top right" />
                <div className="bottom left" />
                <div className="bottom right" />
                <div className="ticket-inline" />
              </div>
              <span>
                <i className="fa fa-times" aria-hidden="true" />
              </span>
              <input
                type="sample"
                className="form-control underline"
                style={{
                  width: `${
                    this.state.amount != 0
                      ? Math.min(this.state.amount.toString().length * 10, 60)
                      : 60
                  }px`
                }}
                id="input-amount"
                placeholder="Amount"
                value={this.state.amount}
                onChange={event =>
                  this.setState({ amount: event.target.value })
                }
                maxLength="4"
              />
              <button
                type="button"
                className="btn btn-success ml-1 my-1 add"
                onClick={event => this.handleAddTicket(event)}
              >
                Add <i className="fa fa-plus" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
        <div className="dropleft">
          <button
            type="button"
            className={`btn btn-info`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            disabled={this.props.lock}
          >
            <i className="fa fa-pencil-square-o" />
          </button>
          <div className="dropdown-menu box-form">
            <textarea
              value={this.props.tickets}
              onChange={this.props.handleEditTicket}
              className="edit-form"
              style={{ overflow: "auto" }}
              placeholder="Enter or paste values for ticket in the box seperated by comma"
            />
          </div>
        </div>
        <button
          type="button"
          className={`btn btn-danger`}
          onClick={this.props.handleResetTicket}
          disabled={this.props.lock}
        >
          <i className="fa fa-trash" />
        </button>
      </div>
    );
  }
}
