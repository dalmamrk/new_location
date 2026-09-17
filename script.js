const map = L.map('map').setView([45.0703, 7.6869], 10); // Torino

// Tile Esri (World Street Map): gratuite, senza API key ne restrizioni di
// referer, funzionano anche aprendo index.html come semplice file locale.
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN',
  maxZoom: 19
}).addTo(map);

const container = document.getElementById('annunci-container');

// --- Sede attuale IFEVS ---
// Sedi IFEVS: mostrate solo come marker sulla mappa (logo), senza scheda laterale.
const LOGO_IFEVS = "immagini/IFEVS_LOGO.png";

const sedi = [
  {
    titolo: "Sede attuale IFEVS",
    indirizzo: "Strada Carignano 50/1, 10040 La Loggia (TO)",
    lat: 44.9436,   // approssimata sulla via, da rifinire con la posizione esatta
    lng: 7.6700
  },
  {
    titolo: "Sede legale IFEVS",
    indirizzo: "Via Carle 1, 12048 Sommariva Bosco (CN)",
    lat: 44.7693,
    lng: 7.7917
  }
];

const logoIcon = L.icon({
  iconUrl: LOGO_IFEVS,
  iconSize: [27, 27],
  iconAnchor: [13, 13],
  popupAnchor: [0, -15],
  className: 'sede-marker'
});

sedi.forEach((s) => {
  const marker = L.marker([s.lat, s.lng], {
    icon: logoIcon,
    zIndexOffset: 1000
  }).addTo(map);
  marker.bindPopup(`<b>${s.titolo}</b><br>${s.indirizzo}`);
});

// Icona "capannone" con una lettera identificativa (A, B, C ...).
// La stessa lettera compare sul marker e sulla scheda laterale.
function iconaCapannone(lettera) {
  return L.divIcon({
    className: '',
    html: `
      <div class="cap-pin">
        <div class="cap-body">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 21V9l10-5 10 5v12h-6v-6H8v6H2z"/>
          </svg>
        </div>
        <span class="cap-letter">${lettera}</span>
      </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -22]
  });
}

// Alfabeto italiano (senza J, K, W, X, Y): A B C D E F G H I L M ...
const ALFABETO = "ABCDEFGHILMNOPQRSTUVZ";

annunci.forEach((a, i) => {
  const lettera = ALFABETO[i] || String(i + 1); // A, B, C ... L, M ...

  const marker = L.marker([a.lat, a.lng], {
    icon: iconaCapannone(lettera)
  }).addTo(map);
  marker.bindPopup(
    `<b>${lettera} · ${a.titolo}</b><br>${a.prezzo} · ${a.mq} m²` +
    `<br><a href="${a.link}" target="_blank" rel="noopener">Vedi annuncio</a>`
  );

  const card = document.createElement('div');
  card.className = 'annuncio';
  card.innerHTML = `
    <img class="foto" src="${a.foto}" alt="${a.titolo}" loading="lazy">
    <div class="contenuto">
      <div class="titolo-riga">
        <span class="lettera">${lettera}</span>
        <h3>${a.titolo}</h3>
      </div>
      <p>${a.indirizzo}</p>
      <p class="dati">${a.prezzo} · ${a.mq} m²</p>
      ${a.note ? `<p>${a.note}</p>` : ''}
      <a href="${a.link}" target="_blank" rel="noopener">Vedi annuncio</a>
    </div>
  `;

  // Il clic sulla scheda centra la mappa; il clic sul link apre l'annuncio.
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    map.setView([a.lat, a.lng], 15);
    marker.openPopup();
  });

  container.appendChild(card);
});
