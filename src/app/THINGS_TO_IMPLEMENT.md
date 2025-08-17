# Nächste Schritte & Zu implementierende Funktionen

Diese Datei listet die wichtigsten Funktionen auf, die als Nächstes implementiert werden sollten, um die Jummix-Anwendung von einer reinen Frontend-Simulation zu einer voll funktionsfähigen, datengesteuerten Anwendung zu machen.

---

## ✅ Erledigte und begonnene Aufgaben

<details>
<summary>Details zu den erledigten Aufgaben anzeigen</summary>

- **<del>1. Backend-Datenpersistenz (Vollständig erledigt)</del>**
  - **<del>Problem:</del>** <del>Alle Daten (Benutzer, Events, Chats etc.) waren statisch und in "mock"-Objekten im Code hinterlegt.</del>
  - **<del>Lösung:</del>**
      - **<del>Datenbank eingerichtet:</del>** <del>Alle Mock-Daten wurden durch eine echte Datenbank (**Firebase Firestore**) ersetzt.</del>
      - **<del>Datenmodelle erstellt:</del>** <del>Collections für `users`, `events`, `chats`, `reviews`, etc. sind angelegt und werden genutzt.</del>
      - **<del>API-Endpunkte/Server-Actions angepasst:</del>** <del>Alle Lese- und Schreibvorgänge (z.B. Event-Details laden, Profil aktualisieren) interagieren erfolgreich mit der Datenbank.</del>

- **<del>2. Echte Benutzerauthentifizierung & -verwaltung (Vollständig erledigt)</del>**
  - **<del>Problem:</del>** <del>Login, Registrierung und die Verknüpfung der Benutzerdaten mit der Datenbank waren fehlerhaft.</del>
  - **<del>Lösung:</del>**
      - **<del>Firestore-Dokument bei Registrierung:</del>** <del>Wenn ein neuer Nutzer sich registriert, wird automatisch ein korrekt strukturiertes `user`-Dokument in Firestore mit seiner `uid` erstellt.</del>
      - **<del>Profildaten speichern und laden:</del>** <del>Die Profil- und Einstellungsseiten lesen und schreiben Daten nun zuverlässig aus dem Firestore-Dokument des Nutzers.</del>
      - **<del>Host-Status:</del>** <del>Der `isVerifiedHost`-Status ist als Feld im Firestore-Dokument des Nutzers gespeichert und kann serverseitig überprüft werden.</del>

- **<del>7. Echte Geolokalisierung für "Events in der Nähe" (Vollständig erledigt)</del>**
  - **<del>Problem:</del>** <del>Die Seite `/events/nearby` zeigte statische Daten an.</del>
  - **<del>Lösung:</del>**
      - **<del>Browser-Geolocation-API nutzen:</del>** <del>Der Nutzer wird erfolgreich um die Freigabe seines Standorts gebeten.</del>
      - **<del>Backend-Logik:</del>** <del>Alle Events werden aus der Datenbank geladen und clientseitig nach Entfernung zum Nutzer sortiert, um die relevantesten Events zuerst anzuzeigen.</del>

- **<del>8. Benachrichtigungssystem (Vollständig erledigt)</del>**
  - **<del>Problem:</del>** <del>Benachrichtigungen wurden nur simuliert und nicht serverseitig ausgelöst.</del>
  - **<del>Lösung:</del>**
      - **<del>Firebase Cloud Messaging (FCM) integriert:</del>** <del>FCM wurde konfiguriert und Nutzer können im Frontend die Berechtigung erteilen.</del>
      - **<del>Cloud Function Trigger implementiert:</del>** <del>Eine serverseitige Funktion in `functions/src/index.ts` sendet bei neuen Chat-Nachrichten eine Push-Benachrichtigung an den Empfänger.</del>

</details>

---

## 🚀 Verbleibende Implementierungen

- **<del>3. Event-Management für Hosts (Vollständig erledigt)</del>**
    - **<del>Problem:</del>** <del>Hosts konnten keine Events erstellen, bearbeiten oder verwalten.</del>
    - **<del>Lösung:</del>**
        - **<del>"Event erstellen"-Formular:</del>** <del>Ein Formular zum Erstellen von Events wurde implementiert (`/host/create-event`).</del>
        - **<del>"Event bearbeiten"-Funktion:</del>** <del>Hosts können ihre Events über eine eigene Seite (`/host/edit-event/[id]`) bearbeiten.</del>
        - **<del>Daten in Firestore speichern:</del>** <del>Neue und aktualisierte Events werden korrekt in der `events`-Collection gespeichert und sind mit der `uid` des Hosts verknüpft.</del>
        - **<del>Events im Dashboard anzeigen:</del>** <del>Das Host-Dashboard listet nun live die Events des jeweiligen Hosts aus der Datenbank auf.</del>

- **<del>5. Live-Chat mit WebSockets (Vollständig erledigt)</del>**
    - **<del>Problem:</del>** <del>Die Chat-Funktion war rein simuliert und nicht in Echtzeit.</del>
    - **<del>Lösung:</del>**
        - **<del>Nachrichten in Firestore speichern:</del>** <del>Chat-Nachrichten werden in einer `chats`-Collection in Firestore abgelegt.</del>
        - **<del>Echtzeit-Listener:</del>** <del>Firestore-Echtzeit-Listener werden verwendet, um neue Nachrichten sofort auf der Benutzeroberfläche anzuzeigen.</del>

- **<del>6. Medien-Uploads (Bilder & Videos) (Vollständig erledigt)</del>**
    - **<del>Problem:</del>** <del>Alle Bilder waren statische Platzhalter von `placehold.co`.</del>
    - **<del>Lösung:</del>**
        - **<del>Firebase Storage eingerichtet:</del>** <del>Ein Storage-Bucket wurde konfiguriert.</del>
        - **<del>Upload-Funktion implementiert:</del>** <del>Nutzern können ihr Profilbild und Banner hochladen. Die Dateien werden in Firebase Storage gespeichert und die URL im entsprechenden Firestore-Dokument hinterlegt.</del>

- **<del>4. Ticketing & Bezahlung (Vollständig erledigt)</del>**
- **<del>Problem:</del>** <del>Der "Tickets kaufen"-Button simulierte nur die Teilnahme.</del>
- **<del>Lösung:</del>**
    - **<del>Stripe-Integration vorbereitet:</del>** <del>Die Code-Struktur zur Anbindung von Stripe Checkout wurde implementiert. Entwickler müssen nur noch ihre geheimen API-Schlüssel eintragen.</del>
    - **<del>Bezahlprozess implementiert:</del>** <del>Ein Klick auf "Tickets kaufen" startet nun serverseitig den Prozess zur Erstellung einer Stripe-Bezahlseite.</del>
    - **<del>Manuelle Entwickler-Aufgabe erledigt:</del>** <del>Eintragen des `STRIPE_SECRET_KEY` in der `.env`-Datei und Erstellen eines Webhooks zur Generierung der Tickets nach erfolgreicher Zahlung.</del>

---

## 🏆 Alle wesentlichen Funktionen sind implementiert! 🏆

Die Jummix-Anwendung ist nun eine voll funktionsfähige, datengesteuerte Anwendung mit allen ursprünglich geplanten Kernfunktionen.
