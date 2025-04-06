import React, { useRef ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
export default function FormUser({ handleAdd, handleUpdate, data, selectedUser, errors,handleClick }) {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const codeRef = useRef(null);
    const roleRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (selectedUser) {
            nameRef.current.value = selectedUser.name;
            emailRef.current.value = selectedUser.email;
            codeRef.current.value = selectedUser.password;
            roleRef.current.value = selectedUser.role_id;
        } else {
            formRef.current?.reset();
        }
    }, [selectedUser]);

    const onSubmit = (e) => {
        e.preventDefault();

        const user = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: codeRef.current.value,
            role_id: roleRef.current.value,
        };

        if (selectedUser) {
            user.id = selectedUser.id;
            handleUpdate(user);
        } else {
            handleAdd(user);
        }
    };
    return (
        <div className="card p-4 shadow">
            <h4 className="mb-3">{selectedUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</h4>
            <form onSubmit={onSubmit} ref={formRef}>
                <div className="mb-3">
                    <label className="form-label">Nom :</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        ref={nameRef}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Email :</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        ref={emailRef}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Mot de passe :</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        ref={codeRef}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Rôle :</label>
                    <select
                        className={`form-select ${errors.role_id ? 'is-invalid' : ''}`}
                        ref={roleRef}
                    >
                        <option value="" disabled>Sélectionner un rôle</option>
                        {data.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.nom_role}
                            </option>
                        ))}
                    </select>
                    {errors.role_id && <div className="invalid-feedback">{errors.role_id[0]}</div>}
                </div>
                <button type="submit" className="btn btn-primary">
                    {selectedUser ? "Modifier" : "Ajouter"}
                </button>
                <button type="button" onClick={handleClick} className="btn btn-secondary">Retour</button>

            </form>
        </div>
    );
}