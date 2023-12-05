import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import SpotifyAPI from "./setting/SpotifyAPI";
import isMobileDevice from "./setting/isMobileDevice";

const currentToken = {
    get access_token() {
        return localStorage.getItem('access_token') || null;
    },
    save: function (response) {
        const {access_token, refresh_token} = response;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
    }
};
export default function Callback() {
    const navigate = useNavigate();
    useEffect(() => {
        if (window.opener || isMobileDevice()) {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            if (code) {
                fetchAccessToken(code).then(data => {
                    if (data && data.access_token) {
                        currentToken.save(data);
                        if (window.opener) {
                            window.opener.postMessage({type: 'authorized'}, '*');
                            window.close();
                        }
                        navigate('/playlists');
                    }
                }).catch(error => {
                    console.error('Error fetching access token:', error);
                    if (window.opener) {
                        window.opener.postMessage({type: 'AUTH_ERROR', error}, '*');
                        window.close();
                    }
                    navigate('/');
                });
            } else if (error) {
                //?error=access_denied
                if (window.opener) {
                    window.opener.postMessage({type: 'AUTH_ERROR', error}, '*');
                    window.close();
                }
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchAccessToken = async (code) => {
        const codeVerifier = localStorage.getItem('code_verifier');
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: SpotifyAPI.client_id,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: SpotifyAPI.redirect_uri,
                code_verifier: codeVerifier,
            }),
        });
        return await response.json();
    };

    return (
        <div>
            Loading...
        </div>
    );
}