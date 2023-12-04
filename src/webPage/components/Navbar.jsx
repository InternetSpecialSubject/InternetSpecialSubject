import {Link} from 'react-router-dom';
export default function Navbar() {
    return (
        <nav>
            <div className="script">
                <Link to="/" className="btn btn-primary">Home</Link>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/playlists" className="btn btn-primary">Playlists</Link>
            </div>
        </nav>
    );
}
