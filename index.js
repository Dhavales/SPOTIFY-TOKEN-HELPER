const express = require('express');
const axios = require('axios');
const app = express();

// IMPORTANT: Paste your credentials here
const CLIENT_ID = '12022143668f4e30a77474aa03536505';
const CLIENT_SECRET = 'cf3e7683f6854f17a67621372c6d2cb9';
// This will be your Vercel URL later
const REDIRECT_URI = 'https://spotify-token-helper-l56b3qyjp-dhavales-projects.vercel.app/callback'; 

app.get('/login', (req, res) => {
    const scope = 'streaming user-read-email user-read-private user-modify-playback-state';
    const authUrl = 'https://api.spotify.com/v1/albums/6i6folBtxKV28WX3msQ4FE2' +
        '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        '&scope=' + encodeURIComponent(scope) +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${auth}`
            }
        });

        const { access_token } = response.data;
        res.send(`<h1>Token Acquired!</h1><p>Copy this token and paste it into your GenieAI DJ app:</p><textarea rows="10" cols="80" readonly>${access_token}</textarea>`);
    } catch (error) {
        res.send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

// Export the app for Vercel
module.exports = app;