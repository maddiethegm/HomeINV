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

    // Function to export transactions as PDF
const exportAsPDF = () => {
    if (!transactions || transactions.length === 0) return;
        const tableElement = document.querySelector("#transactions-table");
    if (!tableElement) {
        console.error("Table element not found");
        return;
    }
    // Log transactions to ensure they are present
    console.log('Transactions:', transactions);

    html2canvas(document.querySelector("#transactions-table"), {
        scrollY: -window.scrollY,
        scale: 2,
        logging: true, // Enable logging for debugging
        useCORS: true // Ensure CORS issues don't cause problems
    }).then(canvas => {
        console.log('Canvas generated:', canvas); // Log the canvas element

        // Check if the canvas is valid and has a width and height
        if (!canvas || !canvas.width || !canvas.height) {
            throw new Error('Invalid canvas or dimensions');
        }

        const imgData = canvas.toDataURL('image/png');

        // Debug statement to check the Data URL
        console.log('Image Data URL:', imgData);

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            compressPdfFonts: true
        });

        // Log image properties before adding to PDF
        console.log('Image Properties:', pdf.getImageProperties(imgData));

        const imgProps = pdf.getImageProperties(imgData);
        if (!imgProps.width || !imgProps.height) {
            throw new Error('Invalid image properties');
        }

        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
        pdf.save("transactions_report.pdf");
    }).catch(err => {
        console.error('Error generating canvas:', err); // Log any errors during canvas generation
    });
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
