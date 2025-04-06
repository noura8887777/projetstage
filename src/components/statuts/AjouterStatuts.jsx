import { useState, useEffect } from "react";
import api from "../Services/Api";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function AjouterStatuts() {
    const navigate = useNavigate();
    const [statutForm, setStatutForm] = useState({ nom_statut: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStatutForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/statuts', statutForm);
            if (response.data.success) {
                navigate('/statuts');
            } else {
                setError(response.data.message || "Erreur lors de l'ajout du statut");
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
            }
            setError(error.response?.data?.message || error.message || "Une erreur est survenue");
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <div className="card shadow-sm">
                <div className="card-header" style={{ 
                    backgroundColor: '#007bff', 
                    color: 'white',
                    borderBottom: '3px solid #dc3545'
                }}>
                    <h2 className="mb-0">
                        <i className="bi bi-tag-fill me-2"></i>
                        Ajouter un Nouveau Statut
                    </h2>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" style={{ 
                            backgroundColor: '#f8d7da', 
                            color: '#721c24',
                            borderColor: '#f5c6cb'
                        }}>
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nom_statut" className="form-label fw-bold" style={{ color: '#495057' }}>
                                <i className="bi bi-card-text me-1"></i>Nom du statut
                            </label>
                            <input
                                type="text"
                                name="nom_statut"
                                id="nom_statut"
                                value={statutForm.nom_statut}
                                onChange={handleChange}
                                className={`form-control ${validationErrors.nom_statut ? 'is-invalid' : ''}`}
                                style={{ borderColor: '#ced4da' }}
                                required
                            />
                            {validationErrors.nom_statut && (
                                <div className="invalid-feedback">
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    {validationErrors.nom_statut[0]}
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-end gap-3">
                            <button
                                type="button"
                                className="btn"
                                style={{ 
                                    backgroundColor: '#6c757d', 
                                    color: 'white',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontWeight: '500'
                                }}
                                onClick={() => navigate('/statuts')}
                                disabled={loading}
                            >
                                <i className="bi bi-x-circle me-1"></i> Annuler
                            </button>
                            <button 
                                type="submit" 
                                className="btn"
                                style={{ 
                                    backgroundColor: '#dc3545', 
                                    color: 'white',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontWeight: '500'
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="bi bi-arrow-repeat spin me-1"></i> Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-1"></i> Enregistrer
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AjouterStatuts;