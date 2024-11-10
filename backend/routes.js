
const express = require('express');
const pool = require('./db');
const router = express.Router();

// Mapa atributa na stvarne nazive kolona u bazi podataka.
// Ovo se koristi kako bi se omogućila dinamička pretraga na temelju atributa koji se šalje kroz upit.
const attributeToColumn = {
    "club_name": "c.club_name",
    "club_country": "c.country",
    "phone_number": "c.phone_number",
    "email": "c.email",
    "year_established": "c.year_established",
    "home_arena": "c.home_arena",
    "league": "c.league",
    "championships_won": "c.championships_won",
    "website": "c.website",
    "light_team_color": "c.light_team_color",
    "dark_team_color": "c.dark_team_color",
    "head_coach_first": "c.head_coach_first",
    "head_coach_last": "c.head_coach_last",
    "player_first_name": "p.first_name",
    "player_last_name": "p.last_name",
    "player_position": "p.position",
    "player_jersey_number": "p.jersey_number",
    "player_nationality": "p.nationality"
};

// Ruta za dohvaćanje svih klubova iz baze podataka
// Ova ruta vraća sve podatke o klubovima, uključujući informacije o igračima (preko LEFT JOIN).
router.get('/clubs', async (req, res) => {
    try {
        // SQL upit za dohvaćanje svih klubova i njihovih igrača
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
        // Vraća podatke u JSON formatu
        res.json(result.rows);
    } catch (error) {
        // Ako se dogodi pogreška u bazi, vraća status 500 s porukom o grešci
        res.status(500).json({ error: 'Error fetching clubs' });
    }
});

// Ruta za pretragu klubova prema određenim parametrima (term i attribute)
// Ova ruta omogućava pretragu klubova na temelju specifičnog atributa ili pretrage po svim atributima.
router.get('/clubs/search', async (req, res) => {
    // Dohvat query parametara 'term' (pojam za pretragu) i 'attribute' (atribut prema kojem pretražujemo)
    const { term, attribute } = req.query;

    // Početni SQL upit za pretragu klubova
    let query = `
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
        WHERE 1=1
    `;

    // Polje za parametre upita koji će se koristiti za filtriranje rezultata
    const params = [];
    if (term) {
        if (attribute && attributeToColumn[attribute]) {
            // Ako je specifičan atribut odabran, pretraga se vrši samo u toj koloni
            query += ` AND ${attributeToColumn[attribute]} ILIKE $1`;
            params.push(`%${term}%`);
        } else {
            // Ako nije odabran specifičan atribut, pretraga se vrši po svim kolonama
            const wildcardTerm = `%${term}%`;
            query += `
                AND (
                    c.club_name ILIKE $1 OR
                    c.country ILIKE $2 OR
                    c.phone_number ILIKE $3 OR
                    c.email ILIKE $4 OR
                    c.year_established::TEXT ILIKE $5 OR
                    c.home_arena ILIKE $6 OR
                    c.league ILIKE $7 OR
                    c.championships_won::TEXT ILIKE $8 OR
                    c.website ILIKE $9 OR
                    c.light_team_color ILIKE $10 OR
                    c.dark_team_color ILIKE $11 OR
                    c.head_coach_first ILIKE $12 OR
                    c.head_coach_last ILIKE $13 OR
                    p.first_name ILIKE $14 OR
                    p.last_name ILIKE $15 OR
                    p.position ILIKE $16 OR
                    p.jersey_number::TEXT ILIKE $17 OR
                    p.nationality ILIKE $18
                )
            `;
            // Dodavanje parametara za svaki od 18 mogućih filtera
            for (let i = 0; i < 18; i++) {
                params.push(wildcardTerm);
            }
        }
    }

    try {
        // Izvršavanje SQL upita s parametrima i slanje rezultata u JSON formatu
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        // Ako dođe do pogreške u upitu, vraća status 500 i poruku o grešci
        res.status(500).json({ error: 'Error fetching clubs with filter' });
    }
});


module.exports = router;
