import { createBrowserRouter } from 'react-router-dom';
import ListCourriers from './components/GestionCourriers/ListeCourriers';
import AjouterCourrier from './components/GestionCourriers/AjouterCourrier';
import NotFound from './components/notFound';
import DetailCourrier from './components/GestionCourriers/DetailCourrier';
import UpdateCourrier from './components/GestionCourriers/UpdateCourrier';
import ListStatuts from './components/statuts/ListStatuts';
import DetailStatut from './components/statuts/DetailStatut';
import AjouterStatuts from './components/statuts/AjouterStatuts';
import UpdateStatut from './components/statuts/UpdateStatut';
import AffectationCourriers from './components/gestion affectation/AffectationCourriers';
import ReponseCourriers from './components/gestion affectation/ReponseCourriers';
import ListeReponses from './components/gestion affectation/ListeReponses';
import TableUser from './Gestion_User/TableUser'; 
import Roles from './Gestion_User/RoleGestion'; 
import TypeCourriers from './Gestion_User/TypeCourrierGestion';
import Login from './Authentification/Login';
import GuestLayout from './Authentification/layouts/GuestLayout';
import DashboardLayout from './Authentification/layouts/DashboardLayout';
import Dashboard from "./Gestion_User/pages/Dashboard";
import UpdateReponse from './components/gestion affectation/UpdateReponse';

const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children:[
            {
                index: true,
                element: <Dashboard/>,
            },
            {
                path: 'users',
                element: <TableUser/>,
            },
            {
                path: 'roles',
                element: <Roles/>,
            },
            {
                path: 'types',
                element: <TypeCourriers/>,
            },
            {
                path: 'courriers',
                element: <ListCourriers />,
            },
            {
                path: 'courriers/ajouter',
                element: <AjouterCourrier />,
            },
            {
                path: 'courriers/:id/edit',
                element: <UpdateCourrier />,
            },
            {
                path: 'courriers/:id',
                element: <DetailCourrier />,
            },
            {
                path: 'affectations/:id',
                element:<AffectationCourriers/>
            },
            {
                path: 'courriers/:id/reponse',
                element:<ReponseCourriers/>
            },
            {
                path: "courriers/:id/reponses",
                element:<ListeReponses/>
            },
            {
                path: 'statuts',
                element:<ListStatuts/>
            },
            {
                path: 'statut/:id',
                element:<DetailStatut/>
            },
            {
                path: 'AjouterStatuts',
                element:<AjouterStatuts/>
            },
            {
                path: 'statut/:id/edit',
                element:<UpdateStatut/>
            },
            {
                path: 'courriers/reponse/:id/edit',
                element: <UpdateReponse/>
            }
        ],
    },
    {
        path: '*',
        element:<NotFound/>
    },
]);

export default router;