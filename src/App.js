// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { useAuth } from "./Authentification/AuthContext";
// import Layout from './components/Layout';
// import ListCourriers from './components/GestionCourriers/ListeCourriers';
// import AjouterCourrier from './components/GestionCourriers/AjouterCourrier';
// import NotFound from './components/notFound';
// import DetailCourrier from './components/GestionCourriers/DetailCourrier';
// import UpdateCourrier from './components/GestionCourriers/UpdateCourrier';
// import ListStatuts from './components/statuts/ListStatuts';
// import DetailStatut from './components/statuts/DetailStatut';
// import AjouterStatuts from './components/statuts/AjouterStatuts';
// import UpdateStatut from './components/statuts/UpdateStatut';
// import AffectationCourriers from './components/gestion_affectation/AffectationCourriers';
// import ReponseCourriers from './components/gestion_affectation/ReponseCourriers';
// import ListeReponses from './components/gestion_affectation/ListeReponses';
// import GuestLayout from './Authentification/layouts/GuestLayout';
// import DashboardLayout from './Authentification/layouts/DashboardLayout';
// import TableUser from './Gestion_User/TableUser'; 
// import Roles from './Gestion_User/RoleGestion'; 
// import TypeCourriers from './Gestion_User/TypeCourrierGestion';
// import Login from './Authentification/Login';
// import Dashboard from "./Gestion_User/pages/Dashboard";

// function App() {
//     const { user, logout } = useAuth();

//     return (
//         <Router>
//             <div className="App">
//                 <nav className="navbar navbar-expand-lg navbar-dark bg-light custom-navbar">
//                     <div className="container-fluid">
//                         <Link className="navbar-brand custom-brand" to="/">Gestion_Courriers</Link>
//                         <button
//                             className="navbar-toggler"
//                             type="button"
//                             data-bs-toggle="collapse"
//                             data-bs-target="#navbarNav"
//                             aria-controls="navbarNav"
//                             aria-expanded="false"
//                             aria-label="Toggle navigation"
//                         >
//                             <span className="navbar-toggler-icon"></span>
//                         </button>
//                         <div className="collapse navbar-collapse" id="navbarNav">
//                             {user !== null ? (
//                                 <ul className="navbar-nav me-auto">
//                                     <li className="nav-item">
//                                         <Link className="nav-link custom-link" to="/dashboard">Dashboard</Link>
//                                     </li>
//                                     <li className="nav-item">
//                                         <Link className="nav-link custom-link" to="/dashboard/users">Liste des utilisateurs</Link>
//                                     </li>
//                                     <li className="nav-item">
//                                         <Link className="nav-link custom-link" to="/dashboard/roles">Liste des Rôles</Link>
//                                     </li>
//                                     <li className="nav-item">
//                                         <Link className="nav-link custom-link" to="/dashboard/types">Liste des Types_Courriers</Link>
//                                     </li>
//                                     <li className="nav-item">
//                                         <button onClick={logout} className="nav-link custom-link">Logout</button>
//                                     </li>
//                                 </ul>
//                             ) : null}
//                             <img
//                                 src="https://emploi24.ma/wp-content/uploads/2023/07/Concours-USMBA-Universite-Sidi-Mohamed-Ben-Abdellah-750x375.webp"
//                                 alt="Logo"
//                                 className="navbar-logo ms-auto"
//                             />
//                         </div>
//                     </div>
//                 </nav>

//                 <div className="container mt-4">
//                     <Routes>
                      
//                         <Route path="/" element={<GuestLayout />}>
//                             <Route index element={<Login />} />
//                         </Route>

                      
//                         <Route path="/dashboard" element={<DashboardLayout />}>
//                             <Route index element={<Dashboard />} />
//                             <Route path="users" element={<TableUser />} />
//                             <Route path="roles" element={<Roles />} />
//                             <Route path="types" element={<TypeCourriers />} />
//                         </Route>

//                         <Route path="/" element={<Layout />}>
//                             <Route index element={<ListCourriers />} />
//                             <Route path="ajouter" element={<AjouterCourrier />} />
//                             <Route path="courriers/:id" element={<DetailCourrier />} />
//                             <Route path="courriers/:id/edit" element={<UpdateCourrier />} />
//                             <Route path="statuts" element={<ListStatuts />} />
//                             <Route path="statuts/:id" element={<DetailStatut />} />
//                             <Route path="statuts/ajouter" element={<AjouterStatuts />} />
//                             <Route path="statuts/:id/edit" element={<UpdateStatut />} />
//                             <Route path="affectation/:id" element={<AffectationCourriers />} />
//                             <Route path="courriers/:id/reponse" element={<ReponseCourriers />} />
//                             <Route path="courriers/:id/reponses" element={<ListeReponses />} />
//                             <Route path="*" element={<NotFound />} />
//                         </Route>
//                     </Routes>
//                 </div>
//             </div>
//         </Router>
//     );
// }

// export default App;
