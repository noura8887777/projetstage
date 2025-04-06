import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaPlus } from "react-icons/fa";
import LigneTable from "./LigneTable";
import FormUser from "./FormUser";
import api from "../services/api";

function TableUser() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState([]);
    const motCherche = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/listUsers`)
            .then(response => {
                setUsers(response.data.users);
                setResult(response.data.users);
                setRoles(response.data.roles);
            })
            .catch(error => console.error("Erreur lors du chargement des données :", error));
    }, []);

    const handleSearch = () => {
        const motC = motCherche.current.value.toLowerCase();
        if (!motC) {
            setResult(users);
            return;
        }

        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(motC) || 
            user.email.toLowerCase().includes(motC)
        );
        setResult(filtered);
    };
    
    const Supprimer = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            axios.delete(`http://127.0.0.1:8000/api/UserDelete/${id}`)
                .then(response => {
                    setUsers(users.filter(user => user.id !== id));
                    setResult(result.filter(user => user.id !== id));
                })
                .catch(error => console.error("Erreur lors de la suppression :", error));
        }
    };

    const handlShowForm = () => {
        setShowForm(true);
        setSelectedUser(null);
        setErrors({}); 
    };
    const handleClick = () => {
        navigate('/dashboard/users'); 
        setShowForm(false);
    };

    const ajouter = (user) => {
        axios.post(`http://127.0.0.1:8000/api/UserAj`, user)
            .then(response => {
                const newUser = response.data.user;
                setUsers([newUser, ...users]);
                setResult([newUser, ...result]);
                alert(response.data.msg);
                setShowForm(false);
            })
            .catch(error => {
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors); 
                } else {
                    console.error("Erreur lors de l'ajout :", error);
                }
            });
    };

    const modifier = async (user) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/UserUpdate/${user.id}`, user);
            const updatedUser = response.data.user;
            setUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
            setResult(result.map(u => (u.id === user.id ? updatedUser : u)));
            alert(response.data.msg);
            setShowForm(false);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors); 
            } else {
                console.error("Erreur lors de la modification :", error);
            }
        }
    };

    const handlerCharger = (user) => {
        setSelectedUser(user);
        setShowForm(true);
        setErrors({}); 
    };

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher par nom ou email..."
                            ref={motCherche}
                            onChange={handleSearch}
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                </div>
                <div className="col-md-6 text-end">
                    <button className="btn btn-primary" onClick={handlShowForm}>
                        <FaPlus /> Ajouter
                    </button>
                </div>
            </div>

            {showForm && (
                <FormUser
                    handleAdd={ajouter}
                    handleUpdate={modifier}
                    data={roles}
                    selectedUser={selectedUser}
                    errors={errors} 
                    handleClick={handleClick}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((user) => (
                            <LigneTable
                                key={user?.id}
                                data={user}
                                handleDelete={Supprimer}
                                handleCharger={() => handlerCharger(user)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TableUser;