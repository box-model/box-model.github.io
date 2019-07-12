import React, { Component } from 'react';

function Ticket(props) {
  const sampleStyle = {
    position: 'absolute',
    left: 10 + Math.floor(props.shift / 3) * 110 + 'px',
    top: 10 + (props.shift % 3) * 60 + 'px'
  };
  return (
    <div
      className={`ticket ${props.value === 'x' ? 'hidden' : ''}`}
      style={sampleStyle}
      role="alert"
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

export default Ticket;
