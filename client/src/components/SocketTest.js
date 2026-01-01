import React, { useState, useEffect } from 'react';
import DataDisplay from './DataDisplay';

function Wstest() {
    const [data, setData] = useState({});


  // Connect to WebSocket and receive data
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3002');

        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            try {
                if (newData.event === 'stat-update') {
                setData(newData);
            }} catch (err) {
                console.log(err);
            }

        };

        return () => {
            ws.close();
        };
    }, []);

    return (

        <div className="Wstest">
        <h1>Live Data Stream</h1>
        <DataDisplay data={data} />
        </div>

    );
}

export default Wstest;
