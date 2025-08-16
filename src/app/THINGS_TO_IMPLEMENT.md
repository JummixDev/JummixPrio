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

- **<del>3. Event-Management für Hosts (Vollständig erledigt)</del>**
    - **<del>Problem:</del>** <del>Hosts konnten keine Events erstellen, bearbeiten oder verwalten.</del>
    - **<del>Lösung:</del>**
        - **<del>"Event erstellen"-Formular:</del>** <del>Ein Formular zum Erstellen von Events wurde implementiert (`/host/create-event`).</del>
        - **<del>"Event bearbeiten"-Funktion:</del>** <del>Hosts können ihre Events über eine eigene Seite (`/host/edit-event/[id]`) bearbeiten.</del>
        - **<del>Daten in Firestore speichern:</del>** <del>Neue und aktualisierte Events werden korrekt in der `events`-Collection gespeichert und sind mit der `uid` des Hosts verknüpft.</del>
        - **<del>Events im Dashboard anzeigen:</del>** <del>Das Host-Dashboard listet nun live die Events des jeweiligen Hosts aus der Datenbank auf.</del>

- **7. Echte Geolokalisierung für "Events in der Nähe" (Frontend erledigt)**
  - **Problem:** Die Seite `/events/nearby` zeigt statische Daten an.
  - **Lösung (Frontend erledigt):**
      - **Browser-Geolocation-API nutzen:** Der Nutzer wird erfolgreich um die Freigabe seines Standorts gebeten.
      - **Noch offen (Backend):** Implementierung einer geografischen Abfrage an die Datenbank (z.B. mit GeoFire für Firestore), um Events im Umkreis des Nutzerstandorts zu filtern und dynamisch anzuzeigen.

- **8. Benachrichtigungssystem (UI erledigt)**
  - **Problem:** Benachrichtigungen werden nur simuliert.
  - **Lösung (Frontend erledigt):**
      - Die Benutzeroberfläche für Benachrichtigungen ist vorhanden.
      - **Noch offen (Backend):** Integration von **Firebase Cloud Messaging (FCM)** und Implementierung der serverseitigen Logik, die bei bestimmten Aktionen (z.B. Erhalt einer neuen Nachricht) eine Benachrichtigung auslöst und versendet.

</details>

---

## 🚀 Verbleibende Implementierungen

## 4. Ticketing & Bezahlung

- **Problem:** Der "Tickets kaufen"-Button simuliert nur die Teilnahme.
- **Lösung:**
    - **Stripe-Integration:** Stripe Checkout implementieren, um echte Zahlungen abzuwickeln.
    - **Ticket-Generierung:** Nach erfolgreicher Zahlung ein "Ticket"-Objekt in der Datenbank erstellen, das den Nutzer mit dem Event verknüpft (z.B. in einer Sub-Collection des Events).

## 5. Live-Chat mit WebSockets

- **Problem:** Die Chat-Funktion ist rein simuliert und nicht in Echtzeit.
- **Lösung:**
    - **Nachrichten in Firestore speichern:** Chat-Nachrichten in einer `chats`-Collection in Firestore ablegen.
    - **Echtzeit-Listener:** Firestore-Echtzeit-Listener verwenden, um neue Nachrichten sofort auf der Benutzeroberfläche anzuzeigen, ohne dass die Seite neu geladen werden muss.

## 6. Medien-Uploads (Bilder & Videos)

- **Problem:** Alle Bilder sind statische Platzhalter von `placehold.co`.
- **Lösung:**
    - **Firebase Storage einrichten:** Einen Storage-Bucket für Benutzer-Uploads konfigurieren.
    - **Upload-Funktion implementieren:** Nutzern ermöglichen, ihr Profilbild, Banner und Galerie-Fotos hochzuladen. Die Dateien werden in Firebase Storage gespeichert und die URL im entsprechenden Firestore-Dokument hinterlegt.
