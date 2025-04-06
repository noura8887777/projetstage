import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Services/Api";
import "bootstrap-icons/font/bootstrap-icons.css";

function UpdateStatut() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [statutUpdate, setStatutUpdate] = useState({ nom_statut: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/statuts/${id}/edit`);
                if (response.data.success) {
                    setStatutUpdate({ nom_statut: response.data.statut.nom_statut });
                }
            } catch (err) {
                setError('Erreur lors du chargement des données: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStatutUpdate(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/statuts/${id}`, statutUpdate);
            if (response.data.success) {
                navigate('/statuts');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Une erreur est survenue lors de la mise à jour");
            console.error('Erreur:', error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2"><i className="bi bi-hourglass me-1"></i>Chargement du statut...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button 
                        className="btn btn-sm btn-outline-secondary ms-3" 
                        onClick={() => navigate('/statuts')}
                    >
                        <i className="bi bi-arrow-left me-1"></i>Retour
                    </button>
                </div>
            </div>
        );
    }

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
                        Modifier le Statut
                    </h2>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nom_statut" className="form-label fw-bold" style={{ color: '#495057' }}>
                                <i className="bi bi-card-text me-1"></i>Nom du statut
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="nom_statut"
                                id="nom_statut"
                                value={statutUpdate.nom_statut}
                                onChange={handleChange}
                                style={{ borderColor: '#ced4da' }}
                                required
                            />
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
                            >
                                <i className="bi bi-x-circle me-1"></i> Annuler
                            </button>
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
                                <i className="bi bi-check-circle me-1"></i> Mettre à jour
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateStatut;