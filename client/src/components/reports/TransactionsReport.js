// src/Components/Reports/TransactionsReport.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TransactionsReport = () => {
    const [transactions, setTransactions] = useState([]);
    const [filterColumn, setFilterColumn] = useState('ID');
    const [searchValue, setSearchValue] = useState('');
    const [exactMatch, setExactMatch] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/reports/transactions', {
                params: {
                    filterColumn,
                    searchValue,
                    exactMatch,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTransactions(response.data);
            setLoading(false); // Set loading to false after fetching transactions
        } catch (err) {
            console.error(err);
            setLoading(false); // Ensure loading is set to false in case of error
        }
    };

    // Function to export transactions as CSV
    const exportAsCSV = () => {
        if (!transactions || transactions.length === 0) return;

        const csvContent = [
            ["Transaction ID", "Route", "Request Payload", "Timestamp", "Username"]
        ];

        transactions.forEach(transaction => {
            csvContent.push([
                transaction.ID,
                transaction.Route,
                JSON.stringify(transaction.RequestPayload),
                transaction.Timestamp,
                transaction.AuthenticatedUsername
            ]);
        });

        const blob = new Blob([csvContent.map(row => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, "transactions_report.csv");
    };

const exportAsPDF = async () => {
    if (!transactions || transactions.length === 0) return;

    const pageHeight = 297; // A4 paper height (mm)
    const pageWidth = 210; // A4 paper width (mm)

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compressPdfFonts: true
    });

    // Assuming each row takes about 6mm vertically (adjust as necessary)
    const rowHeight = 8;
    const rowsPerPage = Math.floor(pageHeight / rowHeight);

    for (let i = 0; i < transactions.length; i += rowsPerPage) {
        const pageTransactions = transactions.slice(i, i + rowsPerPage);

        // Render only the current subset of data
        const tableElement = document.querySelector("#transactions-table");
        const tableClone = tableElement.cloneNode(true); // Clone the original table
        const tbody = tableClone.querySelector('tbody');
        
        // Remove all existing rows from the cloned table's body
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        // Append only the current subset of transactions to the cloned table's body
        pageTransactions.forEach((transaction, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td style=>${transaction.ID}</td>
                <td style=>${transaction.Route}</td>
                <td style="width: 210px; white-space: normal;">
                    <pre style="white-space: pre-wrap; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis; max-height: 80px;">${JSON.stringify(transaction.RequestPayload, null, 2)}</pre>
                </td>
                <td style=>${transaction.Timestamp}</td>
                <td style=>${transaction.AuthenticatedUsername}</td>
            `;
            
            tbody.appendChild(row);
        });

        // Add the cloned table to a container and make it visible
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-10000px'; // Off-screen positioning
        tempContainer.style.left = '-10000px';

        tempContainer.appendChild(tableClone);
        document.body.appendChild(tempContainer);

        await html2canvas(tempContainer, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 5, 5, pageWidth - 10, (pageHeight - 10) * (canvas.height / canvas.width));
        });

        // Remove the temporary container
        document.body.removeChild(tempContainer);

        if ((i + rowsPerPage) < transactions.length) {
            pdf.addPage();
        }
    }

    pdf.save("transactions_report.pdf");
};





    return (
        <div className="container">
            <h2>Transactions Report</h2>
            <div className="mb-3">
                <label htmlFor="filterColumn" className="form-label">Filter Column:</label>
                <input
                    type="text"
                    id="filterColumn"
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="searchValue" className="form-label">Search Value:</label>
                <input
                    type="text"
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    id="exactMatch"
                    checked={exactMatch}
                    onChange={(e) => setExactMatch(e.target.checked)}
                    className="form-check-input"
                />
                <label htmlFor="exactMatch" className="form-check-label">Exact Match</label>
            </div>
            <button onClick={fetchTransactions} className="btn btn-primary me-2 mb-3">Fetch Transactions</button>
            <button onClick={exportAsCSV} className="btn btn-success me-2 mb-3">Export as CSV</button>
            <button onClick={exportAsPDF} disabled={loading || transactions.length === 0} className="btn btn-danger mb-3">
                Export as PDF
            </button>

            {/* Scrollable table container */}
            <div className="overflow-auto" style={{ maxHeight: '400px' }} id="transactions-table-container">
                {loading ? (
                    <p>Loading transactions...</p>
                ) : (
                    <table className="table table-striped table-hover" id="transactions-table">
                        <thead className="thead-light">
                            <tr>
                                <th>Transaction ID</th>
                                <th>Route</th>
                                <th>Request Payload</th>
                                <th>Timestamp</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.ID}>
                                    <td>{transaction.ID}</td>
                                    <td>{transaction.Route}</td>
                                    <td><pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{JSON.stringify(transaction.RequestPayload, null, 2)}</pre></td>
                                    <td>{transaction.Timestamp}</td>
                                    <td>{transaction.AuthenticatedUsername}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TransactionsReport;
