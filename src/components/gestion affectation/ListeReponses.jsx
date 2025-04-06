import React, { useState, useEffect } from 'react';
import api from '../Services/Api';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import "bootstrap-icons/font/bootstrap-icons.css";
function ListeReponses() {
    const { id } = useParams();
    const [reponses, setReponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchReponses = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/courriers/${id}/reponses`);
                
                if (response.data.success) {
                    setReponses(response.data.data);
                } else {
                    setError('Erreur lors du chargement des réponses');
                }
            } catch (err) {
                setError('Erreur de connexion au serveur');
                console.error('Erreur:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchReponses();
    }, [id]);

    const handleSort = (column) => {
        const order = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(order);

        const sortedReponses = [...reponses].sort((a, b) => {
            if (column.includes('date')) {
                return order === 'asc' 
                    ? new Date(a[column]) - new Date(b[column])
                    : new Date(b[column]) - new Date(a[column]);
            }
            
            if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
            return 0;
        });

        setReponses(sortedReponses);
    };

    const exportToExcel = () => {
        const data = reponses.map(reponse => ({
            'ID': reponse.id,
            'N° Ordre Annuel': reponse.num_order_annuel,
            'Date Lettre': reponse.date_lettre ? new Date(reponse.date_lettre).toLocaleDateString() : '',
            'N° Lettre': reponse.num_lettre,
            'Destinataire': reponse.designation_destinataire,
            'Analyse': reponse.analyse_affaire,
            'Date Réponse': reponse.date_reponse ? new Date(reponse.date_reponse).toLocaleDateString() : '',
            'N° Réponse': reponse.num_reponse
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Réponses");
        XLSX.writeFile(workbook, `reponses_courrier_${id}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" style={{ 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24',
                    borderColor: '#f5c6cb'
                }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-3" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3" 
                style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '6px',
                    borderBottom: '3px solid #28a745'
                }}>
                <h1 style={{ color: '#28a745', margin: 0, fontSize: '1.8rem' }}>
                    <i className="bi bi-reply-all me-2"></i>Réponses au courrier #{id}
                </h1>
                <div>
                    <button 
                        onClick={exportToExcel}
                        className="btn me-2"
                        style={{ 
                            backgroundColor: '#007bff', 
                            color: 'white',
                            border: 'none',
                            padding: '8px 15px'
                        }}
                    >
                        <i className="bi bi-file-excel me-1"></i> Excel
                    </button>
                    <Link 
                        to={`/dashboard/courriers/${id}`} 
                        className="btn"
                        style={{ 
                            backgroundColor: '#6c757d', 
                            color: 'white',
                            border: 'none',
                            padding: '8px 15px'
                        }}
                    >
                        <i className="bi bi-arrow-left me-1"></i> Retour
                    </Link>
                </div>
            </div>

            {/* Table */}
            {reponses.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>Aucune réponse trouvée pour ce courrier
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead style={{ 
                            backgroundColor: '#28a745', 
                            color: 'white',
                            position: 'sticky',
                            top: 0
                        }}>
                            <tr>
                                {[
                                    'id',
                                    'num_order_annuel',
                                    'date_lettre',
                                    'num_lettre',
                                    'designation_destinataire',
                                    'analyse_affaire',
                                    'date_reponse',
                                    'num_reponse'
                                ].map((column) => (
                                    <th 
                                        key={column} 
                                        onClick={() => handleSort(column)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        {sortBy === column && (
                                            sortOrder === 'asc' ? ' ↑' : ' ↓'
                                        )}
                                    </th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reponses.map((reponse) => (
                                <tr key={reponse.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td>{reponse.id}</td>
                                    <td>{reponse.num_order_annuel}</td>
                                    <td>{reponse.date_lettre ? new Date(reponse.date_lettre).toLocaleDateString() : '-'}</td>
                                    <td>{reponse.num_lettre}</td>
                                    <td>{reponse.designation_destinataire}</td>
                                    <td>{reponse.analyse_affaire}</td>
                                    <td>{reponse.date_reponse ? new Date(reponse.date_reponse).toLocaleDateString() : '-'}</td>
                                    <td>{reponse.num_reponse || '-'}</td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-2">
                                            <Link
                                                to={`/dashboard/courriers/${reponse.id}`}
                                                className="btn btn-action"
                                                style={{ 
                                                    backgroundColor: '#6c757d', 
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    minWidth: '90px',
                                                    transition: 'all 0.3s',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    textDecoration: 'none'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                                                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                            >
                                                <i className="bi bi-eye-fill me-1"></i> Détails
                                            </Link>
                                            {reponse.fichier && (
                                                <a 
                                                    href={`${api.defaults.baseURL}/courriers/${reponse.id}/fichier`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-action"
                                                    style={{ 
                                                        backgroundColor: '#28a745', 
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        minWidth: '90px',
                                                        transition: 'all 0.3s',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        textDecoration: 'none'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                                                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                                >
                                                    <i className="bi bi-file-earmark-arrow-down-fill me-1"></i> Fichier
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ListeReponses;