
const express = require('express');
const pool = require('./db');
const router = express.Router();
const path = require('path');


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
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: "OK",
            message: "Fetched all clubs successfully",
            response: result.rows
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            status: "Error",
            message: "Error fetching clubs",
            response: null
        });
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




router.get('/clubs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                c.club_name, c.country, c.phone_number, c.email, c.year_established,
                c.home_arena, c.league, c.championships_won, c.website,
                c.light_team_color, c.dark_team_color, c.head_coach_first, c.head_coach_last
            FROM clubs c
            WHERE c.club_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
                status: "Not Found",
                message: `Club with ID ${id} does not exist`,
                response: null
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: "OK",
            message: "Fetched club successfully",
            response: result.rows[0]
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            status: "Error",
            message: "Error fetching club",
            response: null
        });
    }
});



router.post('/clubs', async (req, res) => {
    const {
        club_name, country, phone_number, email, year_established,
        home_arena, league, championships_won, website,
        light_team_color, dark_team_color, head_coach_first, head_coach_last
    } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO clubs (
                club_name, country, phone_number, email, year_established, home_arena, league, championships_won,
                website, light_team_color, dark_team_color, head_coach_first, head_coach_last
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
        `, [club_name, country, phone_number, email, year_established, home_arena, league, championships_won,
            website, light_team_color, dark_team_color, head_coach_first, head_coach_last]);

            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({
                status: "Created",
                message: "Club created successfully",
                response: result.rows[0]
            });
    } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({
                status: "Error",
                message: "Error creating club",
                response: null
            });
    }
});



router.put('/clubs/:id', async (req, res) => {
    const { id } = req.params; // Get the club ID from the request parameters
    const {
        club_name, country, phone_number, email, year_established,
        home_arena, league, championships_won, website,
        light_team_color, dark_team_color, head_coach_first, head_coach_last
    } = req.body; // Extract updated data from the request body

    try {
        const result = await pool.query(`
            UPDATE clubs
            SET 
                club_name = $1,
                country = $2,
                phone_number = $3,
                email = $4,
                year_established = $5,
                home_arena = $6,
                league = $7,
                championships_won = $8,
                website = $9,
                light_team_color = $10,
                dark_team_color = $11,
                head_coach_first = $12,
                head_coach_last = $13
            WHERE club_id = $14
            RETURNING *
        `, [
            club_name, country, phone_number, email, year_established,
            home_arena, league, championships_won, website,
            light_team_color, dark_team_color, head_coach_first, head_coach_last, id
        ]);

        if (result.rows.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
                status: "Not Found",
                message: `Club with ID ${id} does not exist`,
                response: null
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: "OK",
            message: "Club updated successfully",
            response: result.rows[0]
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            status: "Error",
            message: "Error updating club",
            response: null
        });
    }
});




router.delete('/clubs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`DELETE FROM clubs WHERE club_id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
                status: "Not Found",
                message: `Club with ID ${id} does not exist`,
                response: null
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: "OK",
            message: "Club deleted successfully",
            response: result.rows[0]
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            status: "Error",
            message: "Error deleting club",
            response: null
        });
    }
});


router.get('/clubs/country/:country', async (req, res) => {
    const { country } = req.params; // Dohvati parametar zemlje iz URL-a

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
                c.head_coach_last
            FROM clubs c
            WHERE c.country ILIKE $1
        `, [country]);

        if (result.rows.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
                status: "Not Found",
                message: `No clubs found in country: ${country}`,
                response: null
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: "OK",
            message: `Clubs retrieved successfully for country: ${country}`,
            response: result.rows
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            status: "Error",
            message: "Error retrieving clubs by country",
            response: null
        });
    }
});


router.get('/clubs/league/:league', async (req, res) => {
    const { league } = req.params; // Dohvati parametar lige iz URL-a

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
                c.head_coach_last
            FROM clubs c
            WHERE c.league ILIKE $1
        `, [league]);

        if (result.rows.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
                status: "Not Found",
                message: `No clubs found in league: ${league}`,
                response: null
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: "OK",
            message: `Clubs retrieved successfully for league: ${league}`,
            response: result.rows
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            status: "Error",
            message: "Error retrieving clubs by league",
            response: null
        });
    }
});



router.get('/clubs/championships/:count', async (req, res) => {
    const { count } = req.params;

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
                c.head_coach_last
            FROM clubs c
            WHERE c.championships_won > $1
        `, [count]);

        if (result.rows.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
                status: "Not Found",
                message: `No clubs found with more than ${count} championships`,
                response: null
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            status: "OK",
            message: `Clubs retrieved successfully with more than ${count} championships`,
            response: result.rows
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            status: "Error",
            message: "Error retrieving clubs by championships",
            response: null
        });
    }
});


router.get('/openapi', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '../openapi.json'));
});


router.use((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(501).json({
        status: "Not Implemented",
        message: `The requested endpoint ${req.originalUrl} is not implemented`,
        response: null
    });
});

router.all('*', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(501).json({
        status: "Not Implemented",
        message: `Method ${req.method} is not implemented for the requested resource ${req.originalUrl}`,
        response: null
    });
});






module.exports = router;
