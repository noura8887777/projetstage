import { useState, useEffect } from "react";
import api from '../Services/Api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
function AjouterCourrier() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        num_order_annuel: '',
        date_lettre: '',
        num_lettre: '',
        designation_destinataire: '',
        analyse_affaire: '',
        date_reponse: '',
        num_reponse: '',
        type_courrier_id: '',
        statut_id: ''
    });
    const [file, setFile] = useState(null);
    const [types, setTypes] = useState([]);
    const [statuts, setStatuts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/courriers');
                if (response.data.success) {
                    setTypes(response.data.data.types || []);
                    setStatuts(response.data.data.statuts || []);
                } else {
                    setError(response.data.message || 'Erreur lors du chargement des données');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Erreur de connexion au serveur');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            if (file) {
                formData.append('fichier', file);
            }

            const response = await api.post('/courriers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                navigate('/');
            } else {
                setError(response.data.message || "Erreur lors de l'ajout du courrier");
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
            }
            setError(error.response?.data?.message || error.message || "Une erreur est survenue");
            console.error('Erreur:', error);
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
                        <i className="bi bi-envelope-plus me-2"></i>
                        Ajouter un Nouveau Courrier
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
                                    value={form.num_order_annuel}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{ borderColor: '#ced4da' }}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="date_lettre" className="form-label fw-bold" style={{ color: '#495057' }}>
                                    Date de la lettre
                                </label>
                                <input
                                    type="date"
                                    name="date_lettre"
                                    id="date_lettre"
                                    value={form.date_lettre}
                                    onChange={handleChange}
                                    className="form-control"
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
                                    value={form.num_lettre}
                                    onChange={handleChange}
                                    className="form-control"
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
                                    value={form.designation_destinataire}
                                    onChange={handleChange}
                                    className="form-control"
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
                                value={form.analyse_affaire}
                                onChange={handleChange}
                                className="form-control"
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
                                    value={form.date_reponse}
                                    onChange={handleChange}
                                    className="form-control"
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
                                    value={form.num_reponse}
                                    onChange={handleChange}
                                    className="form-control"
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
                                    value={form.type_courrier_id}
                                    onChange={handleChange}
                                    className="form-select"
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
                                    value={form.statut_id}
                                    onChange={handleChange}
                                    className="form-select"
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
                                className="form-control"
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
                                    backgroundColor: '#dc3545', 
                                    color: 'white',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontWeight: '500'
                                }}
                            >
                                <i className="bi bi-save me-1"></i> Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AjouterCourrier;