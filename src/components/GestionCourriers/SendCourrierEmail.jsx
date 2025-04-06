import React, { useState } from 'react';
import api from '../Services/Api';

function SendCourrierEmail({ courrierId }) {
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post(`/courriers/${courrierId}/send-email`, {
                email,
                content,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Erreur lors de l'envoi : " + error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Envoyer le courrier par email</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email du destinataire :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contenu de l'email (HTML autorisé) :</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="5"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SendCourrierEmail;