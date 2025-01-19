
fetch('/auth/status')
    .then(response => response.json())
    .then(data => {
        const nav = document.getElementById('nav-links');
        if (data.isAuthenticated) {
            
            nav.innerHTML = `
                <a href="/profile">Korisnički profil</a>
                <a href="/logout">Odjava</a>
                <a href="/refresh">Osvježi preslike</a>
            `;
        } else {
            
            nav.innerHTML = `<a href="/login">Prijava</a>`;
        }
    })
    .catch(err => {
        console.error('Error fetching authentication status:', err);
    });
