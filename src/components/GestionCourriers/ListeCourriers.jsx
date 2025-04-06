import { useEffect, useState, useRef } from "react";
import api from '../Services/Api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from '../../Authentification/AuthContext';

function ListCourriers() {
    const { user } = useAuth();
    const txtSearch = useRef();
    const [courrier, setCourrier] = useState({
        db: [],
        filtered: []
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [erreur, setErreur] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('depart');

    useEffect(() => {
        // console.log(user)
        const fetchCourrier = async () => {
            setLoading(true);
            try {
                const ConditionRole = user?.role_id === 1 ? '/courriers' : '/courriers/chefService';
                console.log(ConditionRole)
                const token = localStorage.getItem('token');
                const response = await api.get(ConditionRole, {
                    params: {
                        page: pagination.current_page,
                        per_page: pagination.per_page
                    }
                });
                console.log(response.data.data)
                setCourrier({
                    db: response.data.data,
                    filtered: response.data.data
                });
                // console.log(courrier)
                setPagination(response.data.pagination);
            } catch (error) {
                setErreur('Erreur de chargement');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourrier();
    }, [pagination.current_page, pagination.per_page, user?.role]);

    const supHandler = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier ?")) {
            try {
                await api.delete(`/courriers/${id}`);
                setCourrier(prev => ({
                    db: prev.db.filter(cour => cour.id !== id),
                    filtered: prev.filtered.filter(cour => cour.id !== id)
                }));
            } catch (error) {
                setErreur('Erreur lors de la suppression');
            }
        }
    };

    const searchHandler = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filterCourriers = courrier.db.filter((cour) =>
            cour.num_order_annuel.toLowerCase().includes(searchTerm) ||
            cour.designation_destinataire.toLowerCase().includes(searchTerm) ||
            cour.num_lettre.toLowerCase().includes(searchTerm)||
            cour.analyse_affaire.toLowerCase().includes(searchTerm)
        );
        setCourrier((prevState) => ({
            ...prevState,
            filtered: filterCourriers
        }));
    };

    const handleSort = (column) => {
        const order = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(order);

        const sorted = [...courrier.filtered].sort((a, b) => {
            if (!a[column] && !b[column]) return 0;
            if (!a[column]) return order === 'asc' ? 1 : -1;
            if (!b[column]) return order === 'asc' ? -1 : 1;
            
            if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
            return 0;
        });

        setCourrier(prev => ({ ...prev, filtered: sorted }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    const handlePerPageChange = (e) => {
        setPagination(prev => ({ 
            ...prev, 
            per_page: parseInt(e.target.value),
            current_page: 1
        }));
    };

    const exportToExcel = () => {
        const data = courrier.filtered.map(cour => ({
            'ID': cour.id,
            'N° Ordre Annuel': cour.num_order_annuel,
            'Date Lettre': cour.date_lettre ? new Date(cour.date_lettre).toLocaleDateString() : '',
            'N° Lettre': cour.num_lettre,
            'Destinataire': cour.designation_destinataire,
            'Analyse': cour.analyse_affaire,
            'Date Réponse': cour.date_reponse ? new Date(cour.date_reponse).toLocaleDateString() : '',
            'N° Réponse': cour.num_reponse,
            'Type': cour.type_courriers?.nom_type,
            'Statut': cour.statuts?.nom_statut
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Courriers");
        XLSX.writeFile(workbook, `courriers_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const courriersDepart = courrier.filtered.filter(c => c.idDepart === null);
    const courriersReponse = courrier.filtered.filter(c => c.idDepart !== null);

    if (erreur) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {erreur}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-3" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <h1 className="text-danger m-0">
                    <i className="bi bi-mailbox2 me-2"></i>Gestion des Courriers
                </h1>
                <div>
                    <button onClick={exportToExcel} className="btn btn-primary me-2">
                        <i className="bi bi-file-excel me-1"></i> Excel
                    </button>
                    {user?.role_id === 1 && (
                        <Link to="/dashboard/courriers/ajouter" className="btn btn-danger">
                            <i className="bi bi-plus-circle me-1"></i> Ajouter
                        </Link>
                    )}
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher..."
                            onChange={searchHandler}
                        />
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <select 
                        className="form-select"
                        value={pagination.per_page}
                        onChange={handlePerPageChange}
                    >
                        <option value="5">5 par page</option>
                        <option value="10">10 par page</option>
                        <option value="20">20 par page</option>
                        <option value="50">50 par page</option>
                    </select>
                </div>
            </div>

            <ul className="nav nav-tabs mb-4" id="courrierTabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'depart' ? 'active' : ''}`}
                        onClick={() => setActiveTab('depart')}
                    >
                        <i className="bi bi-send-fill me-1"></i>
                        Courriers Départ ({courriersDepart.length})
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'reponse' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reponse')}
                    >
                        <i className="bi bi-reply-fill me-1"></i>
                        Courriers Réponse ({courriersReponse.length})
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'depart' ? 'show active' : ''}`}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-danger text-white">
                                <tr>
                                    <th>#</th>
                                    <th>N° Ordre</th>
                                    <th>Date</th>
                                    <th>N° Lettre</th>
                                    <th>Destinataire</th>
                                    <th>Analyse</th>
                                    <th>Type</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courriersDepart.map(cour => (
                                    <tr key={cour.id}>
                                        <td>{cour.id}</td>
                                        <td>{cour.num_order_annuel}</td>
                                        <td>{cour.date_lettre ? new Date(cour.date_lettre).toLocaleDateString() : ''}</td>
                                        <td>{cour.num_lettre}</td>
                                        <td>{cour.designation_destinataire}</td>
                                        <td>{cour.analyse_affaire}</td>
                                        <td>{cour.type_courriers?.nom_type}</td>
                                        <td>
                                            <span className={`badge ${cour.statuts?.nom_statut === 'Terminé' ? 'bg-success' : 'bg-warning'}`}>
                                                {cour.statuts?.nom_statut}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                {user?.role_id === 1 && (
                                                    <button
                                                        onClick={() => supHandler(cour.id)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                )}
                                                {user?.role_id === 1 && (
                                                    <Link
                                                        to={`/dashboard/courriers/${cour.id}/edit`}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </Link>
                                                )}
                                                <Link
                                                    to={`/dashboard/courriers/${cour.id}`}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </Link>
                                                {user?.role_id === 1 && cour.type_courrier_id === 2 && (
                                                    <Link
                                                        to={`/dashboard/courriers/${cour.id}`}
                                                        className="btn btn-info btn-sm"
                                                    >
                                                        <i className="bi bi-send-fill"></i>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={`tab-pane fade ${activeTab === 'reponse' ? 'show active' : ''}`}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-success text-white">
                                <tr>
                                    <th>#</th>
                                    <th>N° Réponse</th>
                                    <th>Date Réponse</th>
                                    <th>En réponse à</th>
                                    <th>Analyse</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courriersReponse.map(cour => (
                                    <tr key={cour.id}>
                                        <td>{cour.id}</td>
                                        <td>{cour.num_reponse}</td>
                                        <td>{cour.date_reponse ? new Date(cour.date_reponse).toLocaleDateString() : ''}</td>
                                        <td>
                                            {cour.num_lettre} - {cour.designation_destinataire}
                                        </td>
                                        <td>{cour.analyse_affaire}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link
                                                    to={`/dashboard/courriers/reponse/${cour.id}/edit`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="bi bi-pencil-fill"></i> Modifier réponse
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                    Affichage de {(pagination.current_page - 1) * pagination.per_page + 1} à{' '}
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur{' '}
                    {pagination.total} entrées
                </div>
                <nav>
                    <ul className="pagination pagination-sm">
                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(1)}>
                                Première
                            </button>
                        </li>
                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pagination.current_page - 1)}>
                                Précédent
                            </button>
                        </li>
                        
                        {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, i) => {
                            const page = Math.max(1, Math.min(
                                pagination.current_page - 2,
                                pagination.last_page - 4
                            )) + i;
                            if (page > pagination.last_page) return null;
                            return (
                                <li key={page} className={`page-item ${page === pagination.current_page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page)}>
                                        {page}
                                    </button>
                                </li>
                            );
                        })}

                        <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pagination.current_page + 1)}>
                                Suivant
                            </button>
                        </li>
                        <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pagination.last_page)}>
                                Dernière
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default ListCourriers;