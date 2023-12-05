import React, {useState, useEffect} from 'react';
import Navbar from "./components/Navbar";
import PlaylistItem from "./components/PlaylistItem";
import {useNavigate} from "react-router-dom";

export default function PlaylistSelector() {
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [openPlaylistId, setOpenPlaylistId] = useState(null);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    navigate('/login');
                    throw new Error('Unauthorized');
                } else {
                    throw new Error('Failed to fetch playlists');
                }
            })
            .then(data => setPlaylists(data.items))
            .catch(error => {
                console.error(error);
                setPlaylists(null);
            });
    }, [token, navigate]);

    const handleToggle = (playlistId) => {
        setOpenPlaylistId(openPlaylistId === playlistId ? null : playlistId);
    };


    return (
        <div>
            <Navbar/>
            <h2>Your Playlists</h2>
            {playlists && playlists.length > 0 ? (
                playlists.map(playlist => (
                    <PlaylistItem
                        key={playlist.id}
                        playlist={playlist}
                        token={token}
                        isOpen={playlist.id === openPlaylistId}
                        onToggle={handleToggle}
                    />
                ))
            ) : (
                <div>No playlists found.</div>
            )}
        </div>
    );
}