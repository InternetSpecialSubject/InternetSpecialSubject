import React, {useEffect} from 'react';

//Authorization code with PKCE extension
export default function Login() {
    //當開啟網頁時自動執行，可更改
    useEffect(() => {handleLogin().then();},[]);

    const clientId = 'ebf1bf4571374afa83e28c5c465bf0e6';
    const redirectUri = 'http://localhost:3000/callback';

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
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            scope: 'user-read-private user-read-email user-library-read ',
        }).toString();

        window.location.href = url.toString();
    };

    return (
        <div>
            {/*<button onClick={handleLogin}>Login with Spotify</button>*/}
        </div>
    );
}