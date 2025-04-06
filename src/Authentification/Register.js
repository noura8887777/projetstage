import axios from 'axios';
import React, { useState } from 'react';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
            alert('Inscription réussie');
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                // Erreur côté serveur
                alert(`Erreur d'inscription : ${error.response.data.message}`);
            } else if (error.request) {
                // Erreur réseau
                alert('Erreur réseau : Impossible de se connecter au serveur');
            } else {
                // Autres erreurs
                alert(`Erreur : ${error.message}`);
            }
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nom" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
            <input type="password" name="password_confirmation" placeholder="Confirmer le mot de passe" onChange={handleChange} />
            <button type="submit">S'inscrire</button>
        </form>
    );
}

export default Register;
