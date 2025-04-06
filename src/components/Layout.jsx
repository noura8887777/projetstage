import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Layout() {
    const styles = {
        hoverEffect: {
            transition: 'color 0.3s ease, border-bottom 0.3s ease',
        },
        hoverEffectHover: {
            color: '#007bff',
            borderBottom: '2px solid #007bff',
        },
    };

    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand text-dark">Mon Application</Link>
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
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link
                                        to="/"
                                        className="nav-link text-dark"
                                        style={styles.hoverEffect}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#000'}
                                    >
                                        Liste des Courriers
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/statuts"
                                        className="nav-link text-dark"
                                        style={styles.hoverEffect}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#000'}
                                    >
                                        Liste des statuts
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mt-4">
                <Outlet />
            </main>

            <footer className="bg-light text-dark text-center py-3">
                <p className="mb-0">© 2023 Votre Entreprise</p>
            </footer>
        </div>
    );
}

export default Layout;