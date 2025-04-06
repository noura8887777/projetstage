import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./Authentification/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSelectChange = (event) => {
        navigate(event.target.value);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light shadow-sm p-3">
            <div className="container-fluid">
                <Link className="navbar-brand text-primary fw-bold" to="/">Gestion_Courriers</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
                    {user !== null ? (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link text-primary" to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-primary" to="/dashboard/users">Liste des utilisateurs</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-primary" to="/dashboard/courriers">Liste des courriers</Link>
                            </li>
                            
                        </ul>
                    ) : null}
                    {user !== null ? (
                        <select className="form-select w-auto mx-auto" onChange={handleSelectChange} defaultValue="">
                            <option value="" disabled>Autres options</option>
                            <option value="/dashboard/roles">Liste des Rôles</option>
                            <option value="/dashboard/types">Liste des Types_Courriers</option>
                            <option value="/dashboard/statuts">Liste des Status</option>
                        </select>
                    ) : null}
                    {user !== null ? (
                        <button onClick={logout} className="btn btn-outline-primary">Logout</button>
                    ) : null}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
