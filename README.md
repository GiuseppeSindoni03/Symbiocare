# SymbioCare 🏥

SymbioCare è una piattaforma integrata (Web App + Mobile App) progettata per i medici sportivi, finalizzata alla gestione ottimizzata dei pazienti, delle prenotazioni e al monitoraggio costante dei parametri bio-medici.

## 📋 Indice

* [Visione del Progetto](#visione-del-progetto)
* [Architettura del Repository](#architettura-del-repository)
* [Caratteristiche Principali](#caratteristiche-principali)
* [Stack Tecnologico](#stack-tecnologico)
* [Quick Start](#quick-start)
* [Documentazione](#documentazione)

## 🌟 Visione del Progetto

Il core di SymbioCare è la **salute proattiva**. La piattaforma non si limita alla gestione burocratica delle visite, ma permette di condividere e monitorare nel tempo dati vitali come:

* **SPO2** (Saturazione ossigeno)
* **HR** (Frequenza cardiaca)
* **Peso corporeo**
* Altri parametri biometrici tramite integrazione Bluetooth

## 📂 Architettura del Repository

Il progetto è strutturato come un **monorepo** per mantenere sincronizzati lo sviluppo del backend e del frontend:

```
ProgettoISTA2k26/
├── backend/          # API Server (NestJS + PostgreSQL)
├── frontend/         # Web Application (React + Mantine UI)
├── documentazione/   # Manuali, diagrammi e specifiche tecniche
└── README.md         # Questo file
```

## ✨ Caratteristiche Principali

### Per i Medici 🩺

* **Dashboard Pazienti**: Visualizzazione centralizzata dei dati biometrici tramite grafici interattivi.
* **Gestione Appuntamenti**: Sistema di accettazione/rifiuto e gestione slot di disponibilità.
* **Refertazione**: Creazione e archiviazione digitale dei report medici.

### Per i Pazienti 🏃‍♂️

* **Tracking Bio-medico**: Inserimento manuale o automatico (indossabili) dei parametri.
* **Booking**: Prenotazione semplificata delle visite sportive.
* **Onboarding QR**: Registrazione sicura tramite scansione di un codice QR generato dal medico.

## 🛠️ Stack Tecnologico

| Componente | Tecnologie Principali |
|------------|----------------------|
| **Backend** | NestJS, PostgreSQL, TypeORM, JWT, Docker |
| **Frontend** | React, TypeScript, Mantine UI, React Query |
| **DevOps** | Docker, Bcrypt |

## 🚀 Quick Start

### 1. Clonare il Repository

```bash
git clone https://github.com/GiuseppeSindoni03/Symbiocare.git
```

### 2. Setup Backend

Vai nella cartella `backend` e segui le istruzioni nel README locale.

```bash
cd backend
npm install
# Configura il file .env
npm run start
```

### 3. Setup Frontend

Apri un nuovo terminale, vai nella cartella `frontend` e segui il README locale.

```bash
cd frontend
npm install
npm run start
```

## 📖 Documentazione

Tutta la documentazione tecnica, inclusi i diagrammi dell'architettura e le specifiche delle API, è disponibile nella cartella:

👉 [Documentazione Progetto](./documentazione/)




