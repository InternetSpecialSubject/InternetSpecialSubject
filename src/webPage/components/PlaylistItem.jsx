import React, {useState} from 'react';

export default function PlaylistItem({playlist, token, isOpen, onToggle}) {
    const [showSongs, setShowSongs] = useState(false);
    const [songs, setSongs] = useState([]);

    const fetchSongs = () => {
        if (!isOpen) {
            if (!showSongs) {
                fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        setSongs(data.items.map(item => ({
                            name: item.track.name,
                            artist: item.track.artists.map(artist => artist.name).join(", "),
                            imageUrl: item.track.album.images[0].url
                        })));
                    })
                    .catch(error => console.error('Error fetching songs:', error));
            }
        }
        console.log()
        setShowSongs(!showSongs);
        onToggle(playlist.id);
    };

    return (
        <div style={{marginBottom: '20px'}}>
            <button onClick={fetchSongs} style={{display: 'block', textAlign: 'left', cursor: 'pointer'}}>
                {playlist.images.length > 0 && (
                    <img src={playlist.images[0].url} width="300" height="200" alt={playlist.name}/>
                )}
                <div>{playlist.name}</div>
            </button>
            {isOpen && (
                <div>
                    {songs.map((song, index) => (
                        <div key={index} style={{marginTop: '10px'}}>
                            <img src={song.imageUrl} alt={song.name} style={{width: '100px', height: '100px'}}/>
                            <p>{song.name} - {song.artist}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}