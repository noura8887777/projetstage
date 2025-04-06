import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/Api';
import "bootstrap-icons/font/bootstrap-icons.css";
const AffectationCourriers = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courrier, setCourrier] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        user_id: '',
        duree_reponse: '',
        courrier_id: id,
        reponse: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [courrierResponse, usersResponse] = await Promise.all([
                    api.get(`/courriers/${id}`),
                    api.get('/affectations/create')
                ]);

                if (!courrierResponse.data.success) {
                    throw new Error(courrierResponse.data.message || 'Échec du chargement du courrier');
                }
                
                if (!usersResponse.data.success) {
                    throw new Error(usersResponse.data.message || 'Échec du chargement des utilisateurs');
                }

                setCourrier(courrierResponse.data.data);
                setUsers(usersResponse.data.user || []);
            } catch (err) {
                setError(err.message || 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const response = await api.post('/affectations', form);
            
            if (response.data.success) {
                navigate(`/courriers/${id}`);
            } else {
                throw new Error(response.data.message || "Erreur lors de l'affectation");
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Erreur serveur");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
                <button 
                    className="btn btn-outline-secondary mt-3"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-1"></i> Retour
                </button>
            </div>
        );
    }

    if (!courrier) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    Aucun courrier trouvé
                </div>
                <button 
                    className="btn btn-outline-secondary mt-3"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-1"></i> Retour
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-3" style={{ maxWidth: '800px' }}>
            {/* En-tête avec titre rouge */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3" 
                style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '6px',
                    borderBottom: '3px solid #dc3545'
                }}>
                <h1 style={{ 
                    color: '#dc3545', 
                    margin: 0, 
                    fontSize: '1.8rem',
                    fontWeight: '600'
                }}>
                    <i className="bi bi-person-plus me-2"></i>Affectation du courrier #{courrier.id}
                </h1>
                <button 
                    className="btn"
                    onClick={() => navigate(-1)}
                    style={{ 
                        backgroundColor: '#6c757d', 
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px'
                    }}
                >
                    <i className="bi bi-arrow-left me-1"></i> Retour
                </button>
            </div>

            {/* Informations du courrier */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header" style={{ 
                    backgroundColor: '#007bff', 
                    color: 'white'
                }}>
                    <h3 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        Informations du courrier
                    </h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Numéro de lettre:</strong> {courrier.num_lettre}</p>
                            <p><strong>Date de lettre:</strong> {new Date(courrier.date_lettre).toLocaleDateString()}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Destinataire:</strong> {courrier.designation_destinataire}</p>
                            <p><strong>Type:</strong> {courrier.type_courriers?.nom_type}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulaire d'affectation */}
            <div className="card border-0 shadow-sm">
                <div className="card-header" style={{ 
                    backgroundColor: '#007bff', 
                    color: 'white'
                }}>
                    <h3 className="mb-0">
                        <i className="bi bi-person-plus me-2"></i>
                        Nouvelle affectation
                    </h3>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger mb-4">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="courrier_id" value={id} />
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold">Utilisateur</label>
                            <select
                                name="user_id"
                                value={form.user_id}
                                onChange={handleChange}
                                className="form-select"
                                style={{ borderColor: '#ced4da' }}
                                required
                            >
                                <option value="">Sélectionnez un utilisateur</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold">Durée de réponse (jours)</label>
                            <input
                                type="number"
                                name="duree_reponse"
                                value={form.duree_reponse}
                                onChange={handleChange}
                                className="form-control"
                                style={{ borderColor: '#ced4da' }}
                                min="1"
                                required
                            />
                        </div>
                        
                        <div className="mb-4 form-check form-switch">
                            <input 
                                type="checkbox" 
                                name="reponse" 
                                checked={form.reponse}
                                onChange={handleChange}
                                className="form-check-input"
                                id="reponseCheckbox"
                                role="switch"
                            />
                            <label className="form-check-label fw-bold" htmlFor="reponseCheckbox">
                                Besoin de réponse
                            </label>
                        </div>
                        
                        <div className="d-flex justify-content-end">
                            <button 
                                type="submit" 
                                className="btn"
                                style={{ 
                                    backgroundColor: '#28a745', 
                                    color: 'white',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontWeight: '500'
                                }}
                            >
                                <i className="bi bi-check-circle me-1"></i> Valider l'affectation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AffectationCourriers;