import React, { Component } from 'react';
import { ticketPosition } from '../../utils/ticketLayout';

export default class Ticket extends Component {
  componentDidUpdate(prevProps) {
    // Pulse when this ticket has just been drawn. Sampling with replacement
    // leaves it in the box, so this shows which one was picked.
    if (
      this.props.drawSerial &&
      this.props.drawSerial !== prevProps.drawSerial &&
      this.el &&
      this.el.animate
    ) {
      this.el.animate(
        [
          { transform: 'scale(1)', filter: 'brightness(1)' },
          { transform: 'scale(1.12)', filter: 'brightness(1.35)', offset: 0.3 },
          { transform: 'scale(1)', filter: 'brightness(1)' }
        ],
        { duration: Math.max(150, this.props.animationTime) }
      );
    }
  }

  render() {
    const props = this.props;
    const pos = ticketPosition(props.index);
    const style = {
      position: 'absolute',
      left: pos.left + 'px',
      top: pos.top + 'px'
    };
    // A null value is the gap left by a ticket drawn without replacement.
    // It keeps its slot (and its index) so the other tickets don't shift.
    if (props.value === null) {
      return (
        <div
          className="ticket ticket-placeholder"
          style={style}
          data-box-index={props.index}
        />
      );
    }
    return (
      <div
        className="ticket"
        style={style}
        role="alert"
        data-box-index={props.index}
        ref={el => (this.el = el)}
      >
        <strong>{props.value}</strong>
        <button
          type="button"
          className={`close p-1 m-0 ${props.lock ? 'hidden' : ''}`}
          onClick={e => props.handleRemoveTicket(parseInt(props.index))}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}
