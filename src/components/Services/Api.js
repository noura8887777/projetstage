import axios from 'axios';


//creation d'une instance entre URL  et axios
const api= axios.create({
     baseURL: 'http://localhost:8000/api',
});

//  afficher un message d'erreur si la requête échoue
api.interceptors.request.use(
    (Response)=>Response,//si la requiete reussit return le reponse
    (error)=>Promise.reject(error)//si la requete non valide return un message d'erreur
)

export default api;