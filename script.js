// Funzione per aggiornare lo stato del server e il numero di giocatori
function updateServerStatus() {
    // Sostituisci con l'API del tuo server o con i dati reali
    fetch('https://api.yourserver.com/status')
        .then(response => response.json())
        .then(data => {
            document.getElementById('playerCount').textContent = data.players;
            document.getElementById('serverStatus').textContent = data.status;
            
            // Cambia colore in base allo stato
            const statusElement = document.getElementById('serverStatus');
            if (data.status === 'Online') {
                statusElement.style.color = '#4CAF50';
            } else {
                statusElement.style.color = '#F44336';
            }
        })
        .catch(error => {
            console.error('Error fetching server status:', error);
            document.getElementById('serverStatus').textContent = 'Offline';
            document.getElementById('serverStatus').style.color = '#F44336';
        });
}

// Aggiorna lo stato ogni 30 secondi
updateServerStatus();
setInterval(updateServerStatus, 30000);

// Smooth scrolling per i link del menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animazione al caricamento della pagina
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animazione delle feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Filtro veicoli
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Rimuovi active da tutti i pulsanti
            filterBtns.forEach(b => b.classList.remove('active'));
            // Aggiungi active al pulsante cliccato
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            vehicleCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Sistema di donazione PayPal
function setupPayPalButtons() {
    // Pulsanti pacchetti
    document.querySelectorAll('.donate-btn[data-amount]').forEach(btn => {
        const amount = btn.getAttribute('data-amount');
        
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount,
                            currency_code: 'EUR'
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Grazie per la tua donazione di €' + amount + '!');
                    // Puoi aggiungere qui una chiamata al tuo backend
                });
            }
        }).render(btn);
    });
    
    // Pulsante donazione personalizzata
    const customDonateBtn = document.getElementById('custom-donate-btn');
    if (customDonateBtn) {
        paypal.Buttons({
            createOrder: function(data, actions) {
                const amount = document.getElementById('amount').value;
                if (!amount || amount < 1) {
                    alert('Inserisci un importo valido');
                    return;
                }
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount,
                            currency_code: 'EUR'
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    const amount = document.getElementById('amount').value;
                    alert('Grazie per la tua donazione di €' + amount + '!');
                    // Puoi aggiungere qui una chiamata al tuo backend
                });
            }
        }).render(customDonateBtn);
    }
}

// Carica PayPal SDK solo quando necessario
function loadPayPalSDK() {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=TUO_CLIENT_ID&currency=EUR';
    script.onload = setupPayPalButtons;
    document.body.appendChild(script);
}

// Carica PayPal SDK quando si visita la pagina donazioni
if (window.location.pathname.includes('donazioni.html')) {
    loadPayPalSDK();
}