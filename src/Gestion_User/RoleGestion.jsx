import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsPencilSquare, BsTrash, BsPlus, BsCheck } from "react-icons/bs";

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [editingRole, setEditingRole] = useState(null);
    const roleRef = useRef();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/listRoles")
            .then(response => setRoles(response.data.roles || []))
            .catch(error => console.error("Erreur:", error));
    }, []);

    const Ajouter = async () => {
        const newRole = roleRef.current.value.trim();
        if (!newRole) return;
        
        try {
            await axios.post("http://127.0.0.1:8000/api/RoleAj", { nom_role: newRole });
            const response = await axios.get("http://127.0.0.1:8000/api/listRoles");
            setRoles(response.data.roles || []);
            roleRef.current.value = "";
        } catch (err) {
            console.error("Erreur:", err);
        }
    };
    
    const Modifier = async (id) => {
        const RoleMod = roleRef.current.value.trim();
        if (!RoleMod) return;
        
        try {
            await axios.put(`http://127.0.0.1:8000/api/RoleUpdate/${id}`, { nom_role: RoleMod });
            const response = await axios.get("http://127.0.0.1:8000/api/listRoles");
            setRoles(response.data.roles || []);
            setEditingRole(null);
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    const Supprimer = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce rôle ?")) return;
        
        try {
            await axios.delete(`http://127.0.0.1:8000/api/RoleDelete/${id}`);
            const response = await axios.get("http://127.0.0.1:8000/api/listRoles");
            setRoles(response.data.roles || []);
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center text-primary">Liste des rôles</h1>
            <div className="mb-3 d-flex">
                <input type="text" ref={roleRef} className="form-control me-2 border-primary" placeholder="Ajouter un rôle" />
                <button className="btn btn-primary" onClick={Ajouter}>
                    <BsPlus /> 
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover mt-3">
                    <thead className="table-primary">
                        <tr>
                            <th>ID</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <tr key={role.id}>
                                    <td>{role.id}</td>
                                    <td>
                                        {editingRole === role.id ? (
                                            <input type="text" ref={roleRef} className="form-control border-primary" defaultValue={role.nom_role} />
                                        ) : (
                                            role.nom_role
                                        )}
                                    </td>
                                    <td>
                                        {editingRole === role.id ? (
                                            <button className="btn btn-outline-success btn-sm me-2" onClick={() => Modifier(role.id)}>
                                                <BsCheck /> 
                                            </button>
                                        ) : (
                                            <button className="btn btn-outline-warning btn-sm me-2" onClick={() => setEditingRole(role.id)}>
                                                <BsPencilSquare /> 
                                            </button>
                                        )}
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => Supprimer(role.id)}>
                                            <BsTrash /> 
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-danger">Aucun rôle trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}