import React, { Component } from "react";
import Ticket from "./Ticket";
import BoxControl from "./BoxControl";

export default class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  listTickets() {
    return this.props.tickets.map((value, index) => {
      return (
        <Ticket
          key={index}
          value={value}
          shift={index}
          index={index}
          handleRemoveTicket={this.props.handleRemoveTicket}
          lock={this.props.lock}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <div className="row box">
          <div className="background-tag">Box</div>
          <div className={`content`}>
            <div
              className={`wrapper ${
                this.state.visible && !this.props.lock
                  ? "wrapper-visible"
                  : "wrapper-hidden"
              }`}
              onMouseEnter={e => this.setState({ visible: true })}
              onMouseLeave={e => this.setState({ visible: false })}
            >
              {this.listTickets()}
            </div>
          </div>
        </div>
        <div />
      </div>
    );
  }
}
