import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Sidebar component.
 *
 * @param {Object} props - The properties for the component.
 */
function Sidebar() {
    return (
        <div class="offcanvas offcanvas-start w-25" tabindex="-1" id="offcanvas" data-bs-keyboard="false" data-bs-backdrop="false">
            <div class="offcanvas-header">
                <h6 class="offcanvas-title d-none d-sm-block" id="offcanvas">Menu</h6>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body px-0">
                <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu">
                    <li class="nav-item">
                        <Link to="/" class="nav-link text-truncate">
                            <i class="fs-5 bi-house"></i><span class="ms-1 d-none d-sm-inline">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/items-report" class="nav-link text-truncate">
                            <i class="fs-5 bi-speedometer2"></i><span class="ms-1 d-none d-sm-inline">Items Report</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/transactions-report" class="nav-link text-truncate">
                            <i class="fs-5 bi-table"></i><span class="ms-1 d-none d-sm-inline">Transactions Report</span>
                        </Link>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="nav-link dropdown-toggle  text-truncate" id="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fs-5 bi-bootstrap"></i><span class="ms-1 d-none d-sm-inline">Admin</span>
                        </a>
                        <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdown">
                            <li><Link class="dropdown-item" to="/register">Add User</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
