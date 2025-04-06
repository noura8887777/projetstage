import { useEffect, useState } from "react";
import api from "../Services/Api";
import { Link } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
function ListStatuts(){
    const [statut,setStatut]=useState([])
    const [erreur,setErreur]=useState(null);
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const response=await api.get('/statuts')
                // console.log(response.data.data.statuts)
                setStatut(response.data)
                setLoading(false)
                // console.log(statut)
            }catch{
                setErreur('Erreur de chargement');
            }
            
        };
        fetchData()
    },[])
    const supHandler=(id)=>{
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce Statut ?")) {
            try {
                 api.delete(`/statut/${id}`);
                 setStatut((deleteStatut) => deleteStatut.filter((st) => st.id !== id));
                
                console.log(`statut avec l'ID ${id} supprimé avec succès.`);
            } catch (error) {
                setErreur('Erreur lors de la suppression du Statut');
                console.error('Erreur:', error);
            }
        }
    }
    if (loading) return <div>Chargement...</div>;
    if (erreur) return <div>Erreur: {erreur}</div>;
    if (!statut) return <div>Aucun statut trouvé</div>;
  

    return (
        <div className="container mt-3" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <h1 className="text-primary m-0">
                    <i className="bi bi-tags me-2"></i>Gestion des Statuts
                </h1>
                <Link to='/dashboard/AjouterStatuts' className="btn btn-primary">
                    <i className="bi bi-plus-circle me-1"></i> Ajouter
                </Link>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th><i className="bi bi-hash"></i> ID</th>
                            <th><i className="bi bi-card-text"></i> Nom du statut</th>
                            <th><i className="bi bi-gear"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statut.map(st => (
                            <tr key={st.id}>
                                <td>{st.id}</td>
                                <td>{st.nom_statut}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link 
                                            to={`/dashboard/statut/${st.id}`} 
                                            className="btn btn-info btn-sm"
                                            title="Détails"
                                        >
                                            <i className="bi bi-eye-fill"></i>
                                        </Link>
                                        <Link 
                                            to={`/dashboard/statut/${st.id}/edit`} 
                                            className="btn btn-warning btn-sm"
                                            title="Modifier"
                                        >
                                            <i className="bi bi-pencil-fill"></i>
                                        </Link>
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={() => supHandler(st.id)}
                                            title="Supprimer"
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {statut.length === 0 && (
                <div className="alert alert-info mt-3">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Aucun statut disponible
                </div>
            )}
        </div>
    );
}
export default ListStatuts;