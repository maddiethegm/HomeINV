// src/Components/Reports/ItemsReport.js

/**
 * React component for displaying an items report.
 * It fetches item data from an API and provides options to filter, search, and export the data as CSV or PDF.
 */
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Functional component for rendering the ItemsReport.
 *
 * @returns {JSX.Element} - The JSX element representing the report interface.
 */
const ItemsReport = () => {
    /**
     * State to hold the list of items fetched from the API.
     * @type {Array<Object>}
     */
    const [items, setItems] = useState([]);

    /**
     * State to hold the column used for filtering items.
     * @type {string}
     */
    const [filterColumn, setFilterColumn] = useState('ID');

    /**
     * State to hold the search value entered by the user.
     * @type {string}
     */
    const [searchValue, setSearchValue] = useState('');

    /**
     * State to determine if the search should be an exact match.
     * @type {boolean}
     */
    const [exactMatch, setExactMatch] = useState(false);

    /**
     * State to indicate whether data is currently being fetched.
     * @type {boolean}
     */
    const [loading, setLoading] = useState(true); // Add a loading state

    /**
     * State to track the progress of exporting items.
     * @type {number}
     */
    const [exportProgress, setExportProgress] = useState(0); // New progress state

    /**
     * Async function to fetch items from the API based on current filters and search criteria.
     */
    const fetchItems = async () => {
        try {
            const response = await api.get('/reports/items', {
                params: {
                    filterColumn,
                    searchValue,
                    exactMatch,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setItems(response.data);
            setLoading(false); // Set loading to false after fetching transactions
        } catch (err) {
            console.error(err);
            setLoading(false); // Ensure loading is set to false in case of error
        }
    };

    /**
     * Effect hook to fetch items when filterColumn, searchValue, or exactMatch changes.
     */
    useEffect(() => {
// This throws a linting error but fetchItems() is defined above and this works
// eslint-disable-next-line
        fetchItems();
    }, [filterColumn, searchValue, exactMatch]);

    /**
     * Function to export the items list as a CSV file.
     */
    const exportAsCSV = () => {
        if (!items || items.length === 0) return;

        const csvContent = [
            ["Item ID", "Name", "Description", "Location Name", "Bin", "Quantity"]
        ];

        items.forEach(item => {
            csvContent.push([
                item.ID,
                item.Name,
                item.Description,
                item.Location,
                item.Bin,
                item.Quantity
            ]);
        });

        const blob = new Blob([csvContent.map(row => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, "items_report.csv");
    };

    /**
     * Function to export the items list as a PDF file.
     */
    const exportAsPDF = async () => {
        if (!items || items.length === 0) return;
        setExportProgress(0); // Reset progress when starting the export
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
        setExportProgress(20); // Initial progress

        for (let i = 0; i < items.length; i += rowsPerPage) {
            const pageItems = items.slice(i, i + rowsPerPage);

            // Render only the current subset of data
            const tableElement = document.querySelector("#items-table");
            const tableClone = tableElement.cloneNode(true); // Clone the original table
            const tbody = tableClone.querySelector('tbody');
            
            // Remove all existing rows from the cloned table's body
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            // Append only the current subset of items to the cloned table's body
            pageItems.forEach((item, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${item.ID}</td>
                    <td>${item.Name}</td>
                    <td style="width: 210px; white-space: normal;">
                        <pre style="white-space: pre-wrap; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis; max-height: 80px;">${item.Description}</pre>
                    </td>
                    <td>${item.Location}</td>
                    <td>${item.Bin}</td>
                    <td>${item.Quantity}</td>
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

            await html2canvas(tempContainer, { scale: .8 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 5, 5, pageWidth - 10, (pageHeight - 10) * (canvas.height / canvas.width));
            });
            exportProgress += 5;
            // Remove the temporary container
            document.body.removeChild(tempContainer);

            if ((i + rowsPerPage) < items.length) {
                pdf.addPage();
            }
        }
        setExportProgress(100); // Finalize progress at 100%
        pdf.save("items_report.pdf");
    };

    return (
        <div className="container mt-5">
            <h2>Items Report</h2>

            {/* Search Filters */}
            <div className="d-flex mb-3">
                <div className="me-3">
                    <label htmlFor="filterColumn" className="form-label">Filter Column:</label>
                    <input
                        type="text"
                        id="filterColumn"
                        value={filterColumn}
                        onChange={(e) => setFilterColumn(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="me-3">
                    <label htmlFor="searchValue" className="form-label">Search Value:</label>
                    <input
                        type="text"
                        id="searchValue"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="me-3">
                    <label htmlFor="exactMatch" className="form-label">
                        <input
                            type="checkbox"
                            id="exactMatch"
                            checked={exactMatch}
                            onChange={(e) => setExactMatch(e.target.checked)}
                        />{' '}
                        Exact Match
                    </label>
                </div>
            </div>

            {/* Buttons for Exporting */}
            <div className="mb-3">
                <button onClick={fetchItems} className="btn btn-primary me-2">Fetch Items</button>
                <button onClick={exportAsCSV} className="btn btn-success me-2">Export as CSV</button>
                <button onClick={exportAsPDF} disabled={loading || items.length === 0} className="btn btn-danger">
                    Export as PDF
                </button>
                
                {/* Loading bar */}
                {loading ? (
                    <div className="progress mt-3">
                        <div className="progress-bar" role="progressbar" style={{ width: `${exportProgress}%` }} aria-valuenow={exportProgress} aria-valuemin="0" aria-valuemax="100">
                            {Math.round(exportProgress)}%
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Scrollable table container */}
            <div className="overflow-auto" style={{ maxHeight: '400px' }} id="items-table-container">
                {loading ? (
                    <p>Loading items...</p>
                ) : (
                    <table className="table table-striped table-hover" id="items-table">
                        <thead className="thead-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Bin</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.ID}>
                                    <td>{item.ID}</td>
                                    <td>{item.Name}</td>
                                    <td><pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{item.Description}</pre></td>
                                    <td>{item.Location}</td>
                                    <td>{item.Bin}</td>
                                    <td>{item.Quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* No Results Message */}
            {!items.length && (
                <p>No items found.</p>
            )}
        </div>
    );
};

export default ItemsReport;