import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login({ email, password });
      if (!response.success) {
        setErrors(response.errors);
        setIsLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      alert("Échec de connexion");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img 
                    src="https://emploi24.ma/wp-content/uploads/2023/07/Concours-USMBA-Universite-Sidi-Mohamed-Ben-Abdellah-750x375.webp" 
                    alt="Logo" 
                    className="mb-4" 
                    style={{ height: "80px" }}
                  />
                  <h2 className="h4 text-primary mb-3">Connexion</h2>
                  <p className="text-muted">Accédez à votre espace personnel</p>
                </div>

                {errors.message && (
                  <div className="alert alert-danger" role="alert">
                    {errors.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUser className="text-muted" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock className="text-muted" />
                      </span>
                      <input
                        type="password"
                        id="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="d-grid mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : (
                        <FaSignInAlt className="me-2" />
                      )}
                      Se connecter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;