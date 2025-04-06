import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash, FaEdit} from "react-icons/fa";
export default function LigneTable({ data, handleDelete, handleCharger }) {
    return (
        <tr>
            <td>{data.name}</td>
            <td>{data.email}</td>
            <td>{data.role}</td>
            <td>
                <button className="btn btn-outline-danger btn-sm me-2" onClick={() => handleDelete(data.id)}>
                    <FaTrash />
                </button>
                <button className="btn btn-outline-warning btn-sm" onClick={() => handleCharger(data)}>
                    <FaEdit />
                </button>
            </td>
        </tr>
    );
}