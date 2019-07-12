import React from 'react';

export default function(props){

  return (
  <table className="chart">
  <tbody>
    <tr>
      <td className="text-right">count</td>
      <td>=</td>
      <td className="text-left chart-item"><b>{props.count}</b></td>
    </tr>
    <tr>
      <td className="text-right">mean</td>
      <td>=</td>
      <td className="text-left chart-item"><b>{props.count > 0 ? `${props.mean}` : ''}</b></td>
    </tr>
    <tr>
      <td className="text-right">SD</td>
      <td>=</td>
      <td className="text-left chart-item"><b>{props.count > 0 ? `${props.sd}` : ''}</b></td>
    </tr>
    </tbody>
  </table>);
}
