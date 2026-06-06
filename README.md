# 🍜 Neo Tokyo Kitchen — Frontend

## 🧾 Beskrivning

Detta repository innehåller frontend-delen för projektet Neo Tokyo Kitchen, en fiktiv restaurangwebbplats skapad som projektarbete inom kursen Backend-baserad webbutveckling.

Applikationen kommunicerar med ett separat REST API byggt med Node.js, Express och MongoDB Atlas. Frontend-applikationen ansvarar för att presentera restaurangens innehåll, hantera bordsbokningar samt tillhandahålla ett administrativt gränssnitt för personal och administratörer.

Projektet innehåller både publika sidor för besökare och ett skyddat administrationsområde för hantering av meny, personal och bokningar.

---

# 🎯 Syfte

Syftet med projektet är att omsätta kunskaper från tidigare kursmoment i ett större sammanhängande projekt genom att utveckla en restaurangwebbplats med tillhörande administrationssystem och REST-baserad webbtjänst.

Projektet fokuserar på att:

* skapa en publik webbplats som presenterar ett fiktivt restaurangföretag och dess meny
* konsumera data från en extern REST-webbtjänst
* implementera CRUD-funktionalitet för administration av innehåll
* använda JWT för autentisering och skyddade resurser
* arbeta med validering, säkerhet och användarvänlig felhantering
* utveckla dynamisk och interaktiv funktionalitet för både besökare och administratörer
* skapa en responsiv och tillgänglig användarupplevelse
* arbeta med projektstruktur och kodorganisation i en större applikation

Frontend-delen har utvecklats med Angular, TypeScript och SCSS som ett frivilligt teknikval för att skapa en komponentbaserad och skalbar applikation.

---

# 🛠️ Tekniker

Projektet är byggt med:

* Angular
* TypeScript
* Angular Signals
* Angular Services
* Angular Router
* Angular Forms (NgModel)
* Route Guards
* HttpClient
* SCSS
* Iconify
* JWT Authentication

---

# 📦 Projektstruktur

```text
src/
├── app/
│   ├── components/
│   ├── guards/
│   ├── models/
│   │   ├── auth.model.ts
│   │   ├── booking.model.ts
│   │   └── menu.model.ts
│   ├── pages/
│   │   ├── admin-bookings/
│   │   ├── admin-dashboard/
│   │   ├── admin-login/
│   │   ├── admin-menu/
│   │   ├── admin-staff/
│   │   ├── accessibility/
│   │   ├── about/
│   │   ├── booking/
│   │   ├── contact/
│   │   ├── home/
│   │   ├── image-credits/
│   │   ├── menu/
│   │   ├── privacy/
│   │   └── not-found/
│   └── services/
│       ├── auth.service.ts
│       ├── booking.service.ts
│       └── menu.service.ts
public/
├── favicon.png
└── images/
    ├── home/
    ├── hero/
    └── categories/
```

---

# 🌐 Sidor

## Publika sidor

* Startsida
* Meny
* Boka bord
* Om oss
* Kontakt
* Integritetspolicy
* Tillgänglighetsredogörelse
* Bildkällor

## Administration

* Inloggning
* Dashboard
* Personalhantering
* Bokningshantering
* Menyhantering

---

# 🔗 Routing

## Publika routes

```txt
/
/menu
/booking
/about
/contact
/privacy
/accessibility
/credits
```

## Admin-routes

```txt
/admin/login
/admin/dashboard
/admin/staff
/admin/bookings
/admin/menu
```

---

# 🔐 Autentisering

Projektet använder JWT-baserad autentisering.

Användare loggar in med:

* e-post
* lösenord

Vid lyckad inloggning sparas användarens information lokalt och användaren skickas vidare till:

```txt
/admin/dashboard
```

### Roller

* admin
* staff

Administratörer har full åtkomst till administrationssystemet medan personal har begränsade rättigheter.

---

# 👥 Personalhantering

Administratörer kan:

* skapa nya användare
* visa registrerade användare
* ta bort användare
* välja användarroll
* registrera administratörer
* registrera personal

Roller som stöds:

* admin
* staff

Personal utan administratörsbehörighet kan inte skapa nya användare.

Exempel på felmeddelande:

```txt
Du har inte behörighet att lägga till personal.
```

---

# 🍱 Menyhantering

## Kategorier

Full CRUD-funktionalitet för:

* skapa kategorier
* visa kategorier
* uppdatera kategorier
* ta bort kategorier

Administratörer kan hantera:

* namn
* beskrivning
* bild

### Kategoribilder

Administratörer kan:

* välja bild
* förhandsgranska bild
* ladda upp bild

Projektet innehåller även ett fallback-system för kategoribilder.

Om en uppladdad bild inte kan hämtas visas automatiskt någon av följande standardbilder:

* ramen.webp
* rice-bowls.webp
* izakaya.webp
* desserts.webp
* drinks.webp
* fallback.webp

---

## Menyrätter

Full CRUD-funktionalitet för:

* skapa rätter
* visa rätter
* redigera rätter
* ta bort rätter

### Hantering av menyrätter

Administratörer kan hantera: 

* namn
* beskrivning
* pris
* protein
* styrka

### Förhandsvisning

Innan en rätt sparas visas en liveförhandsvisning med:

* namn
* beskrivning
* pris
* proteinikon
* chili-ikoner för styrka

---

# 📅 Bokningshantering

Administratörer kan:

* se bokningar
* söka bokningar
* filtrera bokningar
* redigera bokningar
* ta bort bokningar

Administrationsgränssnittet använder modaler och overlays för bland annat bokningar, kategorier och menyrätter. Bekräftelser vid radering hanteras med en återanvändbar modal-komponent.

---

# 🍽️ Bokningssystem

Bokningssidan innehåller flera specialbyggda komponenter:

## Gästantal

Plus- och minusknappar används för att välja antal gäster.

## Tid

Plus- och minusknappar används för att välja bokningstid i steg om 30 minuter.

## Kalender

Egenbyggd kalender med stöd för:

* klickbara datum
* markering av valt datum
* spärrade tidigare datum
* månadsnavigering
* svensk lokalisering
* veckodagar på svenska

## Bokningssammanfattning

Sammanfattningen uppdateras live och visar:

* antal gäster
* datum
* tid
* namn
* e-post
* telefon

---

# ✅ Validering

Applikationen använder egen frontend-validering för att ge tydlig feedback till användaren.

Exempel på funktionalitet:

* svenska felmeddelanden
* visuell felmarkering av formulärfält
* validering av namn
* validering av e-post
* validering av telefonnummer
* validering av datum
* validering av antal gäster
* dynamisk borttagning av felmarkering när användaren korrigerar inmatningen

Även inloggningssystemet innehåller frontend-validering och användarvänlig felhantering.

---

# 🎨 Grafisk profil

Designen bygger på ett eget Neo Tokyo-koncept inspirerat av cyberpunk-estetik.

### Tema

* Neo Tokyo
* Cyberpunk
* Neon

### Färgpalett

* Neon Pink
* Neon Blue
* Neon Green

### Återkommande designelement

* glow-effekter
* kortbaserade layouter
* overlays
* modaler
* neonikoner
* rundade komponenter

---

# 🌐 Koppling till backend

Frontend-applikationen kommunicerar med projektets REST API.

[Öppna backend repository](https://github.com/fredrikastjernlof/Neo_Tokyo_Kitchen_Backend.git)

---

# 🚀 Installation & körning

## 1. Klona repositoryt

```bash
git clone https://github.com/fredrikastjernlof/Neo_Tokyo_Kitchen_Frontend.git
```

## 2. Installera dependencies

```bash
npm install
```

## 3. Starta utvecklingsservern

```bash
ng serve
```

## 4. Bygg projektet

```bash
ng build
```

---

# 🌐 Publicering

Frontend-applikationen är publicerad via Render.

[Öppna Neo Tokyo Kitchen](https://neo-tokyo-kitchen.onrender.com/)

---

# 🎓 Reflektioner

Detta projekt har varit mitt största fullstacks-projekt hittills och har gett mig möjlighet att arbeta med betydligt mer avancerad funktionalitet än tidigare.

När projektet startade hade jag begränsad erfarenhet av Angular. Under utvecklingen har jag byggt funktioner för autentisering, CRUD-operationer, rollhantering, formulärvalidering, modaler, filuppladdning, bildförhandsvisning, fallback-system och kommunikation med ett externt REST API.

Under arbetets gång har jag fått en djupare förståelse för Angulars komponentstruktur, services, signals och hur frontend och backend samverkar.

En av de viktigaste lärdomarna har varit hur mycket enklare vidareutveckling blir när projektet har en tydlig struktur från början. Samtidigt har felsökning och successiva förbättringar av användarupplevelsen varit en stor del av lärprocessen och bidragit till att jag känner mig betydligt tryggare i Angular idag än när projektet påbörjades.
