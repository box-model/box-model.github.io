import React, { Component } from 'react';
import { CSSTransition, transit } from 'react-css-transition';
CSSTransition.childContextTypes = {};

export default function Sample(props) {
  const left = 10 + Math.floor(props.shift / 3) * 110;
  const top = 10 + (props.shift % 3) * 60;
  const targetLeft = 330;
  const targetTop = 235;
  const sourceTop = -300;
  const sourceLeft = 330;
  let styleSheet = document.styleSheets[0];

  let animationNameLeave = `animation-leave-${props.shift}`;
  let animationNameEnter = `animation-enter-${props.shift}`;

  let keyframesLeave = `@-webkit-keyframes ${animationNameLeave} {
      0% {-webkit-transform:translate(${0}px, ${0}px)}
      50% {-webkit-transform:translate(${targetLeft - left}px, ${0}px)}
      100% {-webkit-transform:translate(${targetLeft - left}px, ${targetTop -
    top}px)}
  }`;
  let keyframesEnter = `@-webkit-keyframes ${animationNameEnter} {
      0% {-webkit-transform:translate(${sourceLeft - left}px, ${sourceTop -
    top}px)}
      100% {-webkit-transform:translate(${0}px, ${0}px)}
  }`;

  const sampleStyle = {
    position: 'absolute',
    left: left + 'px',
    top: top + 'px',
    animation: `${animationNameEnter} ${props.animationTime / 1000 +
      's'} forwards`
  };

  const animatedStyle = {
    position: 'absolute',
    left: left + 'px',
    top: top + 'px',
    animation: `${animationNameLeave} ${Math.max(200, props.animationTime) /
      1000 +
      's'} forwards`
  };

  styleSheet.deleteRule(0);
  styleSheet.insertRule(keyframesLeave, props.shift, 0);
  styleSheet.insertRule(keyframesEnter, props.shift, 0);

  return (
    <div
      style={props.shouldRender ? sampleStyle : animatedStyle}
      className={`ticket`}
    >
      <div className="top left" />
      <div className="top right" />
      <div className="bottom left" />
      <div className="bottom right" />
      <div className="ticket-inline" />
      <strong>{props.value}</strong>
    </div>
  );
}
