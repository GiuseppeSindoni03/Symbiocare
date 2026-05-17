# CONTEXT FILE — SymbioCare on Azure – Proposta Aggiornata

## 📌 Informazioni generali

| Campo | Dettaglio |
|---|---|
| **Nome progetto** | SymbioCare on Azure: Deploy e adattamento cloud di una piattaforma di gestione medica |
| **Repository** | [GiuseppeSindoni03/Symbiocare](https://github.com/GiuseppeSindoni03/Symbiocare/tree/main) |

**Descrizione sintetica:**
Deploy e adattamento cloud della piattaforma SymbioCare, una web application per la gestione di attività medico-sanitarie, sviluppata con frontend React, backend NestJS e database PostgreSQL.

L'architettura viene estesa introducendo una componente **event-driven** per la gestione delle notifiche automatiche relative agli appuntamenti medici.

---

## 🎯 Obiettivi del progetto

- Migrare un'applicazione web tradizionale verso un'architettura **cloud-native su Azure**
- Migliorare:
  - **Scalabilità**
  - **Sicurezza**
  - **Manutenibilità**
- Delegare autenticazione e gestione identità a servizi cloud gestiti
- Implementare pipeline **CI/CD automatizzate**
- Utilizzare servizi gestiti per ridurre complessità infrastrutturale

---

## 🧱 Stack tecnologico

| Layer | Tecnologia |
|---|---|
| **Frontend** | React (SPA) |
| **Backend** | NestJS (Node.js) — API REST |
| **Database** | PostgreSQL con ORM TypeORM |

---

## ☁️ Servizi Azure utilizzati

### Frontend Hosting — Azure Static Web Apps
- Hosting applicazione React
- CI/CD integrata
- Supporto autenticazione

### Backend Hosting — Azure App Service
- Deploy backend NestJS
- Runtime Node.js gestito
- Scalabilità automatica

### Autenticazione — Microsoft Entra ID
- Identity provider
- Login utenti
- Gestione identità delegata

### Database — Azure Database for PostgreSQL
- Database relazionale gestito
- Persistenza dati clinici e utenti

### Gestione segreti — Azure Key Vault
- Conservazione sicura di:
  - Connection string
  - Chiavi JWT
  - Credenziali

### Monitoraggio — Azure Monitor + Application Insights
- Logging
- Metriche
- Analisi errori

### CI/CD — GitHub Actions
- Build automatica
- Deploy continuo su Azure

### Messaggistica — Azure Service Bus
- Gestione degli eventi generati dal backend (creazione/modifica appuntamenti)
- Disaccoppiamento asincrono tra backend e sistema di notifiche

### Elaborazione serverless — Azure Functions
- Elaborazione dei messaggi in modo serverless
- Attivate dai messaggi su Service Bus

### Notifiche — Azure Logic Apps
- Invio delle notifiche email ai pazienti
- Orchestrazione del flusso di notifica

---

## 🔔 Sistema di Notifiche

La piattaforma integra un sistema di notifiche automatiche per migliorare l'esperienza utente e la gestione degli appuntamenti.

### Tipologie di notifiche

| Evento | Destinatario | Canale |
|---|---|---|
| Creazione nuovo appuntamento da parte del dottore | Paziente | Email |
| Richiesta di appuntamento accettata o rifiutata | Paziente | Email |
| Promemoria 24 ore prima della visita | Paziente | Email |
| Modifica o cancellazione dell'appuntamento | Paziente | Email |

---

## ⚡ Architettura Event-Driven

### Flusso notifiche

```
NestJS Backend
     │
     │ pubblica evento (es. appointment_created)
     ▼
Azure Service Bus
     │
     │ attiva
     ▼
Azure Function
     │
     │ invia dati
     ▼
Azure Logic App
     │
     │ invia
     ▼
  Email paziente
```

1. Il backend NestJS genera un evento (es. `appointment_created`)
2. L'evento viene pubblicato su **Azure Service Bus**
3. Una **Azure Function** viene attivata dal messaggio
4. La Function invia i dati a una **Logic App**
5. La Logic App invia l'email al paziente

---

## 🏗️ Architettura del sistema

**Modello:** Architettura a tre livelli (3-tier), distribuita su servizi PaaS

### Componenti principali

| Componente | Servizio Azure | Responsabilità |
|---|---|---|
| **Frontend** | Azure Static Web Apps | Interfaccia utente, comunicazione HTTP con backend |
| **Backend** | Azure App Service | API REST, logica applicativa, gestione autorizzazioni |
| **Database** | Azure Database for PostgreSQL | Persistenza dati |
| **Messaggistica** | Azure Service Bus | Pubblicazione eventi asincroni |
| **Elaborazione eventi** | Azure Functions | Elaborazione serverless dei messaggi |
| **Notifiche** | Azure Logic Apps | Invio email ai pazienti |

---

## 🔐 Flusso di autenticazione

1. L'utente effettua login tramite **Microsoft Entra ID**
2. Il frontend riceve informazioni di identità
3. Il backend:
   - Valida il token
   - Associa l'utente a un record interno
   - Gestisce ruoli e autorizzazioni

---

## 🔄 Flusso applicativo

1. Utente accede al frontend
2. Login tramite **Entra ID**
3. Frontend invia richieste API al backend
4. Backend:
   - Valida autenticazione
   - Esegue logica applicativa
   - Interagisce con PostgreSQL
5. Risposta restituita al frontend

---

## 🔒 Sicurezza

- ✅ Nessuna credenziale salvata nel codice
- ✅ Uso di **Azure Key Vault** per dati sensibili
- ✅ Autenticazione delegata a **Entra ID**
- ✅ Separazione netta tra:
  - **Autenticazione** → cloud (Entra ID)
  - **Autorizzazione** → backend (NestJS)

---

## 📊 Monitoraggio e osservabilità

- Raccolta log centralizzata
- Tracciamento performance backend
- Analisi errori runtime
- Debug facilitato

---

## 🚀 CI/CD

- Pipeline automatizzate con **GitHub Actions**
- Deploy continuo:
  - Frontend → **Static Web Apps**
  - Backend → **App Service**
- Aggiornamenti automatici ad ogni push

---

## 📈 Vantaggi dell'architettura

| Vantaggio | Descrizione |
|---|---|
| **Alta scalabilità** | Gestita nativamente dai servizi PaaS |
| **Riduzione overhead** | Nessuna gestione diretta di server/infrastruttura |
| **Maggiore sicurezza** | Key Vault + Entra ID |
| **Deploy automatizzato** | Pipeline CI/CD con GitHub Actions |
| **Architettura modulare** | Componenti indipendenti e mantenibili |
| **Pattern asincroni** | Event-driven con Service Bus + Functions + Logic Apps |
| **Cloud-native** | Utilizzo di servizi avanzati per scalabilità e resilienza |

---

## ⚠️ Assunzioni e vincoli

- Applicazione basata su **REST** (no GraphQL)
- Backend mantiene logica di **autorizzazione**
- Database **relazionale** (no NoSQL)
- Forte dipendenza da servizi **Azure**

---

## 🧠 Come l'AI deve aiutare

L'AI deve supportare in:

- 🏛️ **Progettazione architetturale cloud**
- 💰 **Ottimizzazione costi Azure**
- 🔐 **Best practice sicurezza**
- ⚙️ **Configurazione servizi Azure**
- 🐛 **Debugging deploy e CI/CD**
- ⚡ **Miglioramento performance backend/frontend**
- 📈 **Suggerimenti su scalabilità e resilienza**
