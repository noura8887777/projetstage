import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Services/Api";
import "bootstrap-icons/font/bootstrap-icons.css";

function DetailStatut() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statut, setStatut] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/statut/${id}`);
        if (response.data.success) {
          setStatut(response.data.data);
        } else {
          setErreur("Erreur lors du chargement des données");
        }
      } catch (error) {
        setErreur("Erreur de connexion au serveur");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {erreur}
        </div>
        <button 
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate("/statuts")}
        >
          <i className="bi bi-arrow-left me-1"></i> Retour à la liste
        </button>
      </div>
    );
  }

  if (!statut) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          Aucun statut trouvé
        </div>
        <button 
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate("/statuts")}
        >
          <i className="bi bi-arrow-left me-1"></i> Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-3" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
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
          <i className="bi bi-tag-fill me-2"></i>Détails du statut #{statut.id}
        </h1>
        <div className="d-flex gap-2">
          <button 
            className="btn"
            onClick={() => navigate("/statuts")}
            style={{ 
              backgroundColor: '#6c757d', 
              color: 'white',
              border: 'none',
              padding: '8px 15px'
            }}
          >
            <i className="bi bi-arrow-left me-1"></i> Retour
          </button>
          <button 
            className="btn"
            onClick={() => navigate(`/statuts/${id}/edit`)}
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white',
              border: 'none',
              padding: '8px 15px'
            }}
          >
            <i className="bi bi-pencil me-1"></i> Modifier
          </button>
        </div>
      </div>

      {/* Informations Générales */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header" style={{ 
          backgroundColor: '#007bff', 
          color: 'white'
        }}>
          <h4 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Informations Générales
          </h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold">ID:</label>
                <p>{statut.id}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="fw-bold">Nom du statut:</label>
                <p>{statut.nom_statut}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courriers associés */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header" style={{ 
          backgroundColor: '#007bff', 
          color: 'white'
        }}>
          <h4 className="mb-0">
            <i className="bi bi-envelope-paper me-2"></i>
            Courriers associés
          </h4>
        </div>
        <div className="card-body">
          {statut.courriers && statut.courriers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>N° Ordre</th>
                    <th>Date lettre</th>
                    <th>N° Lettre</th>
                    <th>Destinataire</th>
                    <th>Analyse</th>
                    <th>Date réponse</th>
                    <th>N° Réponse</th>
                  </tr>
                </thead>
                <tbody>
                  {statut.courriers.map((courrier) => (
                    <tr key={courrier.id}>
                      <td>{courrier.id}</td>
                      <td>{courrier.num_order_annuel ?? <span className="text-muted">Non défini</span>}</td>
                      <td>{courrier.date_lettre ?? <span className="text-muted">Non défini</span>}</td>
                      <td>{courrier.num_lettre}</td>
                      <td>{courrier.designation_destinataire}</td>
                      <td>{courrier.analyse_affaire}</td>
                      <td>{courrier.date_reponse || <span className="text-muted">-</span>}</td>
                      <td>{courrier.num_reponse || <span className="text-muted">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <i className="bi bi-info-circle-fill me-2"></i>
              Aucun courrier associé à ce statut
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailStatut;