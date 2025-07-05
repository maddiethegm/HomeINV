// src/Components/Reports/TransactionsReport.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TransactionsReport = () => {
    const [transactions, setTransactions] = useState([]);
    const [filterColumn, setFilterColumn] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [exactMatch, setExactMatch] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/reports/transactions', {
                params: {
                    filterColumn,
                    searchValue,
                    exactMatch
                }
            });
            setTransactions(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Transactions Report</h2>
            <div>
                <label htmlFor="filterColumn">Filter Column:</label>
                <input
                    type="text"
                    id="filterColumn"
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="searchValue">Search Value:</label>
                <input
                    type="text"
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="exactMatch">
                    <input
                        type="checkbox"
                        id="exactMatch"
                        checked={exactMatch}
                        onChange={(e) => setExactMatch(e.target.checked)}
                    />
                    Exact Match
                </label>
            </div>
            <button onClick={fetchTransactions}>Fetch Transactions</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Route</th>
                        <th>Request Payload</th>
                        <th>Timestamp</th>
                        <th>Authenticated Username</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.ID}>
                            <td>{transaction.ID}</td>
                            <td>{transaction.Route}</td>
                            <td><pre>{JSON.stringify(transaction.RequestPayload, null, 2)}</pre></td>
                            <td>{transaction.Timestamp}</td>
                            <td>{transaction.AuthenticatedUsername}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsReport;
