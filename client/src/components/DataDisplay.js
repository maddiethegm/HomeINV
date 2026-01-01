import React from 'react';

function DataDisplay({ data }) {
  return (
    <div className="data-container">
      <div className="data-item">
        <span>Timestamp: {data.timestamp}</span>
        <br />
        <span>Value: {data.value}</span>
        <br />
        <span>Status: {data.status}</span>
      </div>
    </div>
  );
}

export default DataDisplay;
