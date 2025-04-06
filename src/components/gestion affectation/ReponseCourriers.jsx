import { useState } from "react";
import api from "../Services/Api";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
function ReponseCourriers() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        num_order_annuel: '',
        date_lettre: '',
        num_lettre: '',
        designation_destinataire: '',
        analyse_affaire: '',
        date_reponse: '',
        num_reponse: '',
        fichier: null,
        idDepart: id
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setForm(prev => ({
            ...prev,
            fichier: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('num_lettre', form.num_lettre);
        formData.append('date_lettre', form.date_lettre);
        formData.append('num_order_annuel', form.num_order_annuel);
        formData.append('designation_destinataire', form.designation_destinataire);
        formData.append('analyse_affaire', form.analyse_affaire);
        formData.append('date_reponse', form.date_reponse);
        formData.append('num_reponse', form.num_reponse);
        formData.append('idDepart', form.idDepart);
        
        if (form.fichier) {
            formData.append('fichier', form.fichier);
        }
    
        try {
            const response = await api.post(`/courriers/${id}/reponse`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            if (response.data.success) {

                navigate(`/courriers/${id}/reponses`, {
                    state: { success: 'Réponse enregistrée avec succès!' }
                });
            }
        } catch (error) {
            console.error('Erreur:', error.response?.data);
            setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-3" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3" 
                style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '6px',
                    borderBottom: '3px solid #17a2b8'
                }}>
                <h1 style={{ color: '#17a2b8', margin: 0, fontSize: '1.8rem' }}>
                    <i className="bi bi-reply-all me-2"></i>Réponse au courrier #{id}
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="btn"
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

            {error && (
                <div className="alert alert-danger mb-4" style={{ 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24',
                    borderColor: '#f5c6cb'
                }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                    <div className="mb-3">
                            <label htmlFor="num_order_annuel" className="form-label fw-bold">
                                <i className="bi bi-123 me-2"></i>Numéro de depart : {id}
                            </label>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="num_order_annuel" className="form-label fw-bold">
                                <i className="bi bi-123 me-2"></i>Numéro d'ordre annuel
                            </label>
                            <input
                                type="text"
                                name="num_order_annuel"
                                id="num_order_annuel"
                                value={form.num_order_annuel}
                                onChange={handleChange}
                                className="form-control"
                                required
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="date_lettre" className="form-label fw-bold">
                                <i className="bi bi-calendar me-2"></i>Date de la lettre
                            </label>
                            <input
                                type="date"
                                name="date_lettre"
                                id="date_lettre"
                                value={form.date_lettre}
                                onChange={handleChange}
                                className="form-control"
                                required
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="num_lettre" className="form-label fw-bold">
                                <i className="bi bi-envelope me-2"></i>Numéro de lettre
                            </label>
                            <input
                                type="text"
                                name="num_lettre"
                                id="num_lettre"
                                value={form.num_lettre}
                                onChange={handleChange}
                                className="form-control"
                                required
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="designation_destinataire" className="form-label fw-bold">
                                <i className="bi bi-person-lines-fill me-2"></i>Destinataire
                            </label>
                            <input
                                type="text"
                                name="designation_destinataire"
                                id="designation_destinataire"
                                value={form.designation_destinataire}
                                onChange={handleChange}
                                className="form-control"
                                required
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="analyse_affaire" className="form-label fw-bold">
                                <i className="bi bi-journal-text me-2"></i>Analyse de l'affaire
                            </label>
                            <textarea
                                name="analyse_affaire"
                                id="analyse_affaire"
                                value={form.analyse_affaire}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                                required
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="date_reponse" className="form-label fw-bold">
                                <i className="bi bi-calendar-check me-2"></i>Date de réponse
                            </label>
                            <input
                                type="date"
                                name="date_reponse"
                                id="date_reponse"
                                value={form.date_reponse}
                                onChange={handleChange}
                                className="form-control"
                                required
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="num_reponse" className="form-label fw-bold">
                                <i className="bi bi-reply-all me-2"></i>Numéro de réponse
                            </label>
                            <input
                                type="text"
                                name="num_reponse"
                                id="num_reponse"
                                value={form.num_reponse}
                                onChange={handleChange}
                                className="form-control"
                                required
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="fichier" className="form-label fw-bold">
                                <i className="bi bi-file-earmark-arrow-up me-2"></i>Fichier joint
                            </label>
                            <input
                                type="file"
                                name="fichier"
                                id="fichier"
                                onChange={handleFileChange}
                                className="form-control"
                                style={{ border: '1px solid #ced4da', borderRadius: '4px' }}
                            />
                            <small className="text-muted">Formats acceptés: PDF, Word, Excel, Images</small>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button
                        type="button"
                        className="btn me-3"
                        onClick={() => navigate(-1)}
                        style={{ 
                            backgroundColor: '#6c757d', 
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            minWidth: '120px'
                        }}
                    >
                        <i className="bi bi-x-circle me-1"></i> Annuler
                    </button>
                    <button 
                        type="submit" 
                        className="btn"
                        disabled={loading}
                        style={{ 
                            backgroundColor: '#28a745', 
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            minWidth: '120px'
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                En cours...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle me-1"></i> Enregistrer
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReponseCourriers;