const express = require('express');
const pool = require('./db');
const { requiresAuth } = require('express-openid-connect');
const path = require('path');
const fs = require('fs');
const router = express.Router();



router.get('/profile', requiresAuth(), (req, res) => {
    
    const user = req.oidc.user;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;

    
    const profilePage = `
        <html>
        <head>
            <title>Korisnički profil</title>
        </head>
        <body>
            <h1>Korisnički profil</h1>
            <h1>Welcome, ${user.name}</h1>
            <ul>
                <li>Email: ${user.email}</li>
                <li><strong>Client ID:</strong> ${clientId}</li>
                <li><strong>Client Secret:</strong> ${clientSecret}</li>
            </ul>
            <a href="/">Natrag na početnu stranicu</a>
        </body>
        </html>
    `;

    res.send(profilePage);
});



router.get('/logout', (req, res) => {
    res.oidc.logout({
        returnTo: process.env.AUTH0_BASE_URL,
    });
});





function convertToCSV(data) {
    const headers = Object.keys(data[0]).join(','); 
    const rows = data.map(row => Object.values(row).join(',')); 
    return [headers, ...rows].join('\n');
}

router.get('/refresh', requiresAuth(), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.club_name,
                c.country,
                c.phone_number,
                c.email,
                c.year_established,
                c.home_arena,
                c.league,
                c.championships_won,
                c.website,
                c.light_team_color,
                c.dark_team_color,
                c.head_coach_first,
                c.head_coach_last,
                p.first_name AS player_first_name,
                p.last_name AS player_last_name,
                p.position AS player_position,
                p.jersey_number AS player_jersey_number,
                p.nationality AS player_nationality
            FROM clubs c
            LEFT JOIN players p ON c.club_id = p.club_id
        `);

        if (result.rows.length === 0) {
            return res.status(404).send('No data found to refresh.');
        }

        const enrichedData = result.rows.map(row => ({
            ...row,
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: row.club_name,
            location: {
                "@type": "SportsActivityLocation",
                "name": row.home_arena
            },
            coach: {
                "@type": "Person",
                "name": `${row.head_coach_first} ${row.head_coach_last}`
            },
            url: row.website
        }));

        const jsonData = JSON.stringify(enrichedData, null, 2);
        const csvData = convertToCSV(enrichedData);

        const jsonFilePath = path.join(__dirname, '../handball_clubs.json');
        const csvFilePath = path.join(__dirname, '../handball_clubs.csv');

        fs.writeFileSync(jsonFilePath, jsonData);
        fs.writeFileSync(csvFilePath, csvData);

        res.send(`
            <h1>Podaci su uspješno osvježeni!</h1>
            <a href="/">Povratak na početnu stranicu</a>
        `);
    } catch (error) {
        console.error('Error refreshing data:', error);
        res.status(500).send('Došlo je do pogreške prilikom osvježavanja podataka.');
    }
});






module.exports = router;