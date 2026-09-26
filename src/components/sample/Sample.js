import React, { Component } from 'react';
import { ticketPosition } from '../../utils/ticketLayout';

// Where departing tickets fly to (towards the statistics box), in the
// sample area's coordinates.
const LEAVE_TARGET = { left: 330, top: 235 };
// Where tickets fly in from if their source in the box can't be found.
const FALLBACK_SOURCE = { left: 330, top: -300 };

export default class Sample extends Component {
  componentDidMount() {
    if (this.props.shouldRender) this.flyIn();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shouldRender && !this.props.shouldRender) {
      this.flyOut();
    } else if (!prevProps.shouldRender && this.props.shouldRender) {
      // This element is being reused for the first ticket of a new sample.
      this.flyIn();
    }
  }

  componentWillUnmount() {
    this.cancel();
  }

  cancel() {
    if (this.anim) {
      this.anim.cancel();
      this.anim = null;
    }
  }

  animate(keyframes, duration) {
    if (!this.el || !this.el.animate || duration <= 0) return;
    this.anim = this.el.animate(keyframes, {
      duration: duration,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
  }

  // Fly in from the drawn ticket's actual place in the box. Positions are
  // measured on screen, so the box's scroll offset is accounted for.
  flyIn() {
    this.cancel();
    const duration = this.props.animationTime;
    if (!this.el || duration <= 0) return;
    const dest = this.el.getBoundingClientRect();
    const source =
      this.props.origin != null
        ? document.querySelector(`[data-box-index="${this.props.origin}"]`)
        : null;
    let from;
    if (source) {
      const rect = source.getBoundingClientRect();
      from = { x: rect.left - dest.left, y: rect.top - dest.top };
    } else {
      const pos = ticketPosition(this.props.shift);
      from = {
        x: FALLBACK_SOURCE.left - pos.left,
        y: FALLBACK_SOURCE.top - pos.top
      };
    }
    this.animate(
      [
        { transform: `translate(${from.x}px, ${from.y}px)` },
        { transform: 'translate(0px, 0px)' }
      ],
      duration
    );
  }

  // Fly down towards the statistics box when the sample is aggregated.
  flyOut() {
    this.cancel();
    const pos = ticketPosition(this.props.shift);
    const dx = LEAVE_TARGET.left - pos.left;
    const dy = LEAVE_TARGET.top - pos.top;
    this.animate(
      [
        { transform: 'translate(0px, 0px)' },
        { transform: `translate(${dx}px, 0px)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px)` }
      ],
      this.props.leaveTime
    );
  }

  render() {
    const pos = ticketPosition(this.props.shift);
    return (
      <div
        ref={el => (this.el = el)}
        style={{ position: 'absolute', left: pos.left + 'px', top: pos.top + 'px' }}
        className="ticket"
      >
        <div className="top left" />
        <div className="top right" />
        <div className="bottom left" />
        <div className="bottom right" />
        <div className="ticket-inline" />
        <strong>{this.props.value}</strong>
      </div>
    );
  }
}
