// Inicijalizacija praznog niza koji će držati podatke koji se dohvaćaju s API-ja
let currentData = []; 

// Funkcija koja dohvaća podatke sa servera, filtrira ih prema zadanim uvjetima
async function fetchData(searchTerm = "", attribute = "") {
    // Slanje GET zahtjeva prema API-ju s parametrima za pretragu
    const response = await fetch(`/api/clubs/search?term=${encodeURIComponent(searchTerm)}&attribute=${encodeURIComponent(attribute)}`);
    
    // Parsiranje odgovora iz JSON formata
    const data = await response.json();
    
    // Pohranjivanje dohvaćenih podataka u globalnu varijablu currentData
    currentData = data; 

    // Dohvaćanje tijela HTML tablice prema ID-u
    const tableBody = document.getElementById("data-table-body");
    
    // Brisanje trenutnog sadržaja tablice prije nego što dodamo nove podatke
    tableBody.innerHTML = "";

    // Iteracija kroz sve dohvaćene podatke i dodavanje novih redova u tablicu
    data.forEach(item => {
        const row = document.createElement("tr"); // Kreiranje novog HTML reda
        row.innerHTML = `   <!-- Dinamičko popunjavanje reda podacima iz itema -->
            <td>${item.club_name}</td>
            <td>${item.country}</td>
            <td>${item.phone_number}</td>
            <td>${item.email}</td>
            <td>${item.year_established}</td>
            <td>${item.home_arena}</td>
            <td>${item.league}</td>
            <td>${item.championships_won}</td>
            <td>${item.website}</td>
            <td>${item.light_team_color}</td>
            <td>${item.dark_team_color}</td>
            <td>${item.head_coach_first}</td>
            <td>${item.head_coach_last}</td>
            <td>${item.player_first_name}</td>
            <td>${item.player_last_name}</td>
            <td>${item.player_position}</td>
            <td>${item.player_jersey_number}</td>
            <td>${item.player_nationality}</td>
        `;
        
        // Dodavanje novog reda u tijelo tablice
        tableBody.appendChild(row);
    });

    // Inicijalizacija DataTable-a za bolju interaktivnost tablice (sortiranje, pretraga itd.)
    $('#dataTable').DataTable();
}

// Event listener za klik na gumb za pretragu
document.getElementById("search-btn").addEventListener("click", (e) => {
    e.preventDefault(); // Sprečava ponovno učitavanje stranice prilikom klika
    const searchTerm = document.getElementById("searchInput").value; // Dohvaćanje pojma za pretragu iz input polja
    const attribute = document.getElementById("attributeSelect").value; // Dohvaćanje atributa za pretragu iz padajućeg izbornika
    fetchData(searchTerm, attribute); // Pozivanje funkcije za dohvat podataka s novim parametrima
});

// Event listener za klik na gumb za preuzimanje CSV datoteke
document.getElementById("exportCsvBtn").addEventListener("click", () => {
    const csv = convertToCSV(currentData); // Pretvaranje trenutnih podataka u CSV format
    downloadFile(csv, "data.csv", "text/csv"); // Pozivanje funkcije za preuzimanje datoteke u CSV formatu
});

// Event listener za klik na gumb za preuzimanje JSON datoteke
document.getElementById("exportJsonBtn").addEventListener("click", () => {
    const formattedJson = formatDataForDownload(currentData); // Formatiranje podataka u željeni oblik za preuzimanje
    const json = JSON.stringify(formattedJson, null, 2); // Pretvaranje formiranih podataka u JSON string, s lijepim formatiranjem
    downloadFile(json, "data.json", "application/json"); // Pozivanje funkcije za preuzimanje JSON datoteke
});

// Funkcija koja pretvara podatke u CSV format
function convertToCSV(data) {
    // Definicija zaglavlja CSV datoteke
    const header = [
        "clubname", "country", "phonenumber", "email", "yearestablished", "homearena", 
        "league", "championshipswon", "website", "lightteamcolor", "darkteamcolor", 
        "headcoachfirstname", "headcoachlastname", "playerfirstname", "playerlastname", 
        "playerposition", "playerjerseynumber", "playernationality"
    ];

    // Mapiranje podataka u format redaka za CSV
    const rows = data.map(item => [
        item.club_name, item.country, item.phone_number, item.email, item.year_established,
        item.home_arena, item.league, item.championships_won, item.website, item.light_team_color,
        item.dark_team_color, item.head_coach_first, item.head_coach_last, item.player_first_name,
        item.player_last_name, item.player_position, item.player_jersey_number, item.player_nationality
    ]);

    // Spajanje zaglavlja i redaka u jednu CSV datoteku
    const csv = [header, ...rows].map(row => row.join(",")).join("\n");
    return csv; // Vraća generirani CSV string
}

// Funkcija za preuzimanje datoteke s podacima
function downloadFile(data, filename, mimeType) {
    // Kreiranje Blob objekta koji sadrži podatke za preuzimanje
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob); // Kreiranje URL-a za Blob podatke
    const link = document.createElement("a"); // Kreiranje HTML linka za preuzimanje
    link.href = url; // Postavljanje URL-a za preuzimanje
    link.download = filename; // Postavljanje imena datoteke
    link.click(); // Pokretanje preuzimanja
    URL.revokeObjectURL(url); // Oslobađanje resursa
}

function formatDataForDownload(data) {
    const formattedData = [];
    const clubMap = {};

    data.forEach(item => {
        if (!clubMap[item.club_name]) {
            clubMap[item.club_name] = {
                "ClubName": item.club_name,
                "Country": item.country,
                "PhoneNumber": item.phone_number,
                "Email": item.email,
                "YearEstablished": item.year_established,
                "HomeArena": item.home_arena,
                "League": item.league,
                "ChampionshipsWon": item.championships_won,
                "Website": item.website,
                "TeamColors": {
                    "Light": item.light_team_color,
                    "Dark": item.dark_team_color
                },
                "HeadCoach": {
                    "FirstName": item.head_coach_first,
                    "LastName": item.head_coach_last
                },
                "Players": [],
                "@context": "https://schema.org",
                "@type": "SportsTeam",
                name: item.club_name,
                location: {
                    "@type": "SportsActivityLocation",
                    "name": item.home_arena
                },
                coach: {
                    "@type": "Person",
                    "name": `${item.head_coach_first} ${item.head_coach_last}`
                },
                url: item.website
            };
        }

        clubMap[item.club_name].Players.push({
            "FirstName": item.player_first_name,
            "LastName": item.player_last_name,
            "Position": item.player_position,
            "JerseyNumber": item.player_jersey_number,
            "Nationality": item.player_nationality
        });
    });

    for (const club in clubMap) {
        formattedData.push(clubMap[club]);
    }

    return formattedData;
}


// Pokretanje inicijalnog dohvaćanja podataka bez pretrage
fetchData();
