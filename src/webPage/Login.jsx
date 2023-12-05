import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import SpotifyAPI from "./setting/SpotifyAPI";
import isMobileDevice from "./setting/isMobileDevice";

//Authorization code with PKCE extension
export default function Login() {
    const navigate = useNavigate();
    const [authWindow, setAuthWindow] = useState(null);
    const [isLoginAttempted, setIsLoginAttempted] = useState(false);
    useEffect(() => {
        if (!isLoginAttempted) {
            handleLogin().then();
            setIsLoginAttempted(true);
        }
        const handleAuthMessage = (event) => {
            if (event.data.type === 'authorized') {
                //console.log('授權成功！');
                navigate('/playlists');
            } else if (event.data.type === 'AUTH_ERROR') {
                //console.error('授權失敗:', event.data.error);
                navigate('/');
            }
        };
        const interval = setInterval(() => {
            if (authWindow && authWindow.closed) {
                //console.log('授權頁面被關閉了');
                clearInterval(interval);
                setIsLoginAttempted(false);
                navigate('/');
            }
        }, 1000);
        window.addEventListener('message', handleAuthMessage, false);
        return () => {
            window.removeEventListener('message', handleAuthMessage, false);
            clearInterval(interval);
        };
    }, [navigate, authWindow]);

    const generateCodeVerifier = () => {
        const array = new Uint32Array(28);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
    };

    const sha256 = async (buffer) => {
        const hash = await crypto.subtle.digest('SHA-256', buffer);
        return new Uint8Array(hash);
    };

    const base64urlEncode = (a) => {
        return btoa(String.fromCharCode.apply(null, a))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const handleLogin = async () => {
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = base64urlEncode(await sha256(new TextEncoder().encode(codeVerifier)));
        localStorage.setItem('code_verifier', codeVerifier);
        const url = new URL('https://accounts.spotify.com/authorize');
        url.search = new URLSearchParams({
            client_id: SpotifyAPI.client_id,
            response_type: 'code',
            redirect_uri: SpotifyAPI.redirect_uri,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            scope: SpotifyAPI.scope,
        }).toString();
        if (isMobileDevice()) {
            window.location.href = url.toString();
        } else {
            const win = window.open(url.toString(), '_blank');
            setAuthWindow(win);
        }
    };

    return (<div>
        {/*<button onClick={handleLogin}>Login with Spotify</button>*/}
    </div>);
}