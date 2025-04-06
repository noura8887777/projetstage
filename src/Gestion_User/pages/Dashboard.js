import React, { useEffect, useState } from "react";
import { FaUsers, FaUserTie, FaUserShield } from "react-icons/fa";
import api from "../../services/api";

const Dashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("listUsers")
            .then(response => {
                setUsers(response.data.users);
            })
            .catch(error => console.error("Erreur lors du chargement des données :", error));
    }, []);

    const totalUsers = users.length;
    const chefServiceCount = users.filter(user => user.role === "chef-Service").length;
    const superAdminCount = users.filter(user => user.role === "super-admin").length;
    
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-dark">Tableau de bord</h2>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center" style={cardStyle}>
                        <div className="card-body">
                            <FaUsers size={50} className="text-primary" />
                            <h5 className="card-title mt-3 text-dark">Total Utilisateurs</h5>
                            <p className="card-text text-muted">{totalUsers} utilisateur(s)</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center" style={cardStyle}>
                        <div className="card-body">
                            <FaUserTie size={50} className="text-success" />
                            <h5 className="card-title mt-3 text-dark">Chefs de Services</h5>
                            <p className="card-text text-muted">{chefServiceCount} personne(s)</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center" style={cardStyle}>
                        <div className="card-body">
                            <FaUserShield size={50} className="text-danger" />
                            <h5 className="card-title mt-3 text-dark">Super Admins</h5>
                            <p className="card-text text-muted">{superAdminCount} personne(s)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
};

export default Dashboard;