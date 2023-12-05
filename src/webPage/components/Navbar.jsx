import {Link} from 'react-router-dom';
import '../css/script.css';
export default function Navbar() {
    return (
            <div className="btn_container">
                <Link to="/" className="btn_style">Home</Link>
                <Link to="/login" className="btn_style">Login</Link>
                <Link to="/playlists" className="btn_style">Playlists</Link>
            </div>
    );
}
