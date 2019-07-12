import React from 'react';

export default function Alert(props){
  return (
  <div className="alert alert-danger my-alert">
    <strong>{props.msg}</strong>
    <button type="button" 
      className="close" 
      onClick={e => props.clearAlert()}>
      <span aria-hidden="true">&times;</span>
    </button>
  </div>)
}