import React, { Component } from "react";
import Ticket from "./Ticket";

export default class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  listTickets() {
    const lastDraw = this.props.lastDraw;
    return this.props.tickets.map((value, index) => {
      return (
        <Ticket
          key={index}
          value={value}
          index={index}
          drawSerial={lastDraw && lastDraw.index === index ? lastDraw.serial : 0}
          animationTime={this.props.animationTime}
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
          {/* id lets the sampler scroll a ticket into view before drawing it */}
          <div className="content" id="box-content">
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
