import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/Api';
import "bootstrap-icons/font/bootstrap-icons.css";
const UpdateCourrier = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [types, setTypes] = useState([]);
    const [statuts, setStatuts] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    
    const [formData, setFormData] = useState({
        num_order_annuel: '',
        date_lettre: '',
        num_lettre: '',
        designation_destinataire: '',
        analyse_affaire: '',
        date_reponse: '',
        num_reponse: '',
        type_courrier_id: '',
        statut_id: '',
        fichier: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/courriers/${id}/edit`);
                if (response.data.success) {
                    const courrier = response.data.data.currierMod;
                    setFormData({
                        num_order_annuel: courrier.num_order_annuel,
                        date_lettre: courrier.date_lettre,
                        num_lettre: courrier.num_lettre,
                        designation_destinataire: courrier.designation_destinataire,
                        analyse_affaire: courrier.analyse_affaire,
                        date_reponse: courrier.date_reponse || '',
                        num_reponse: courrier.num_reponse || '',
                        type_courrier_id: courrier.type_courrier_id,
                        statut_id: courrier.statut_id
                    });
                    setTypes(response.data.data.types);
                    setStatuts(response.data.data.statuts);
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            fichier: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Données à envoyer:', formData);
        try {
            const response = await api.put(`/courriers/${id}`, formData
        //         ,{
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //              }
        //     }
         );
        // console.log('Réponse du serveur:', response.data);
            
            if (response.data.success) {
                navigate('/');
            }
        } catch (error) {
            console.error('Erreur complète:', error.response);
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
                setError("Veuillez corriger les erreurs dans le formulaire");
            } else {
                setError(error.response?.data?.message || "Erreur inconnue");
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
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
                        <i className="bi bi-pencil-square me-2"></i>
                        Modifier le Courrier
                    </h2>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" style={{ 
                            backgroundColor: '#f8d7da', 
                            color: '#721c24',
                            borderColor: '#f5c6cb'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="num_order_annuel" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Numéro d'ordre annuel
                                </label>
                                <input
                                    type="text"
                                    name="num_order_annuel"
                                    id="num_order_annuel"
                                    value={formData.num_order_annuel}
                                    onChange={handleChange}
                                    className={`form-control ${validationErrors.num_order_annuel ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                    required
                                />
                                {validationErrors.num_order_annuel && (
                                    <div className="invalid-feedback">
                                        {validationErrors.num_order_annuel[0]}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="date_lettre" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Date de la lettre
                                </label>
                                <input
                                    type="date"
                                    name="date_lettre"
                                    id="date_lettre"
                                    value={formData.date_lettre}
                                    onChange={handleChange}
                                    className={`form-control ${validationErrors.date_lettre ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="num_lettre" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Numéro de lettre
                                </label>
                                <input
                                    type="text"
                                    name="num_lettre"
                                    id="num_lettre"
                                    value={formData.num_lettre}
                                    onChange={handleChange}
                                    className={`form-control ${validationErrors.num_lettre ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="designation_destinataire" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Destinataire
                                </label>
                                <input
                                    type="text"
                                    name="designation_destinataire"
                                    id="designation_destinataire"
                                    value={formData.designation_destinataire}
                                    onChange={handleChange}
                                    className={`form-control ${validationErrors.designation_destinataire ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="analyse_affaire" className="form-label fw-bold" style={{ color: '#495057' }}>
                                Analyse de l'affaire
                            </label>
                            <textarea
                                name="analyse_affaire"
                                id="analyse_affaire"
                                value={formData.analyse_affaire}
                                onChange={handleChange}
                                className={`form-control ${validationErrors.analyse_affaire ? 'is-invalid' : ''}`}
                                style={{ borderColor: '#ced4da', minHeight: '100px' }}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="date_reponse" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Date de réponse
                                </label>
                                <input
                                    type="date"
                                    name="date_reponse"
                                    id="date_reponse"
                                    value={formData.date_reponse}
                                    onChange={handleChange}
                                    className={`form-control ${validationErrors.date_reponse ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="num_reponse" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Numéro de réponse
                                </label>
                                <input
                                    type="text"
                                    name="num_reponse"
                                    id="num_reponse"
                                    value={formData.num_reponse}
                                    onChange={handleChange}
                                    className={`form-control ${validationErrors.num_reponse ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="type_courrier_id" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Type de courrier
                                </label>
                                <select
                                    name="type_courrier_id"
                                    id="type_courrier_id"
                                    value={formData.type_courrier_id}
                                    onChange={handleChange}
                                    className={`form-select ${validationErrors.type_courrier_id ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                    required
                                >
                                    <option value="">Sélectionnez un type</option>
                                    {types.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.nom_type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="statut_id" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Statut
                                </label>
                                <select
                                    name="statut_id"
                                    id="statut_id"
                                    value={formData.statut_id}
                                    onChange={handleChange}
                                    className={`form-select ${validationErrors.statut_id ? 'is-invalid' : ''}`}
                                    style={{ borderColor: '#ced4da' }}
                                    required
                                >
                                    <option value="">Sélectionnez un statut</option>
                                    {statuts.map(statut => (
                                        <option key={statut.id} value={statut.id}>
                                            {statut.nom_statut}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="fichier" className="form-label fw-bold" style={{ color: '#495057' }}>
                                Fichier joint <small className="text-muted">(PDF, Word, Excel)</small>
                            </label>
                            <input
                                type="file"
                                name="fichier"
                                id="fichier"
                                onChange={handleFileChange}
                                className={`form-control ${validationErrors.fichier ? 'is-invalid' : ''}`}
                                style={{ borderColor: '#ced4da' }}
                                accept=".pdf,.doc,.docx,.xlsx"
                            />
                            {validationErrors.fichier && (
                                <div className="text-danger mt-1">
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    {validationErrors.fichier[0]}
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
                                onClick={() => navigate('/')}
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
};

export default UpdateCourrier;