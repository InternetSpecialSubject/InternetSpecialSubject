import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

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
        const code = new URLSearchParams(window.location.search).get('code');
        const codeVerifier = localStorage.getItem('code_verifier');
        if (code) {
            fetchAccessToken(code, codeVerifier).then(data => {
                if (data && data.access_token) {
                    currentToken.save(data);
                    navigate('/playlists');
                }
            }).catch(error => {
                console.error('Error fetching access token:', error);
            });
        } else if (new URLSearchParams(window.location.search).get('error')) {
            //?error=access_denied
            navigate('/');
        }
    }, [navigate]);

    const fetchAccessToken = async (code, codeVerifier) => {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: 'ebf1bf4571374afa83e28c5c465bf0e6',
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3000/callback',
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