import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsPencilSquare, BsTrash, BsPlus, BsCheck } from "react-icons/bs";

export default function TypeCourriers() {
    const [typeCourriers, setTypeCourriers] = useState([]);
    const [editingTypeCourrier, setEditingTypeCourrier] = useState(null);
    const typeCourrierRef = useRef();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/listTypeCourrier")
            .then(response => setTypeCourriers(response.data.typeCourriers || []))
            .catch(error => console.error("Erreur:", error));
    }, []);

    const Ajouter = async () => {
        const newTypeCourrier = typeCourrierRef.current.value.trim();
        if (!newTypeCourrier) return;
        
        try {
            await axios.post("http://127.0.0.1:8000/api/TypeCourrierAj", { nom_type: newTypeCourrier });
            const response = await axios.get("http://127.0.0.1:8000/api/listTypeCourrier");
            setTypeCourriers(response.data.typeCourriers || []);
            typeCourrierRef.current.value = "";
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    const Modifier = async (id) => {
        const TypeCourrierMod = typeCourrierRef.current.value.trim();
        if (!TypeCourrierMod) return;
        
        try {
            await axios.put(`http://127.0.0.1:8000/api/TypeCourrierUpdate/${id}`, { nom_type: TypeCourrierMod });
            const response = await axios.get("http://127.0.0.1:8000/api/listTypeCourrier");
            setTypeCourriers(response.data.typeCourriers || []);
            setEditingTypeCourrier(null);
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    const Supprimer = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce type de courrier ?")) return;
        
        try {
            await axios.delete(`http://127.0.0.1:8000/api/TypeCourrierDelete/${id}`);
            const response = await axios.get("http://127.0.0.1:8000/api/listTypeCourrier");
            setTypeCourriers(response.data.typeCourriers || []);
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center text-primary">Liste des Types de Courrier</h1>
            <div className="mb-3 d-flex">
                <input 
                    type="text" 
                    ref={typeCourrierRef} 
                    className="form-control me-2 border-primary" 
                    placeholder="Ajouter un type de courrier" 
                />
                <button className="btn btn-primary" onClick={Ajouter}>
                    <BsPlus /> 
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover mt-3">
                    <thead className="table-primary">
                        <tr>
                            <th>ID</th>
                            <th>Type de Courrier</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {typeCourriers.length > 0 ? (
                            typeCourriers.map((typeCourrier) => (
                                <tr key={typeCourrier.id}>
                                    <td>{typeCourrier.id}</td>
                                    <td>
                                        {editingTypeCourrier === typeCourrier.id ? (
                                            <input 
                                                type="text" 
                                                ref={typeCourrierRef} 
                                                className="form-control border-primary" 
                                                defaultValue={typeCourrier.nom_type} 
                                            />
                                        ) : (
                                            typeCourrier.nom_type
                                        )}
                                    </td>
                                    <td>
                                        {editingTypeCourrier === typeCourrier.id ? (
                                            <button 
                                                className="btn btn-outline-success btn-sm me-2" 
                                                onClick={() => Modifier(typeCourrier.id)}
                                            >
                                                <BsCheck /> 
                                            </button>
                                        ) : (
                                            <button 
                                                className="btn btn-outline-warning btn-sm me-2" 
                                                onClick={() => setEditingTypeCourrier(typeCourrier.id)}
                                            >
                                                <BsPencilSquare /> 
                                            </button>
                                        )}
                                        <button 
                                            className="btn btn-outline-danger btn-sm" 
                                            onClick={() => Supprimer(typeCourrier.id)}
                                        >
                                            <BsTrash /> 
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-danger">Aucun type de courrier trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}