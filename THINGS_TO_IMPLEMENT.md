# Nächste Schritte & Zu implementierende Funktionen

Diese Datei listet die wichtigsten Funktionen auf, die als Nächstes implementiert werden sollten, um die Jummix-Anwendung von einer reinen Frontend-Simulation zu einer voll funktionsfähigen, datengesteuerten Anwendung zu machen.

## 1. Backend-Datenpersistenz (Höchste Priorität)

- **Problem:** Alle Daten (Benutzer, Events, Chats etc.) sind derzeit statisch und in "mock"-Objekten im Code hinterlegt. Sie werden bei jedem Neuladen der Seite zurückgesetzt.
- **Lösung:**
    - **Datenbank einrichten:** Alle Mock-Daten durch eine echte Datenbank wie **Firebase Firestore** ersetzen.
    - **Datenmodelle erstellen:** Collections für `users`, `events`, `chats`, `reviews`, etc. anlegen.
    - **API-Endpunkte/Server-Actions anpassen:** Alle Lese- und Schreibvorgänge (z.B. ein Event erstellen, ein Profil aktualisieren) so umbauen, dass sie mit der Datenbank interagieren.

## 2. Echte Benutzerauthentifizierung & -verwaltung

- **Problem:** Die Login- und Registrierungsfunktionen sind mit dem Firebase Auth Emulator verbunden, aber die Benutzerdaten (Bio, Interessen etc.) werden nicht in einer Datenbank gespeichert.
- **Lösung:**
    - **Firestore-Dokument bei Registrierung:** Wenn ein neuer Nutzer sich registriert, automatisch ein `user`-Dokument in Firestore mit seiner `uid` erstellen.
    - **Profildaten speichern:** Die Profil- und Einstellungsseiten so anpassen, dass sie Daten aus dem Firestore-Dokument des Nutzers lesen und dorthin schreiben.
    - **Host-Status:** Den `isVerifiedHost`-Status als Feld im Firestore-Dokument des Nutzers speichern und serverseitig überprüfen.

## 3. Event-Management für Hosts

- **Problem:** Hosts können keine Events erstellen, bearbeiten oder verwalten. Die angezeigten Events sind statisch.
- **Lösung:**
    - **"Event erstellen"-Formular:** Ein umfassendes Formular erstellen, mit dem Hosts alle Event-Details (Name, Datum, Ort, Beschreibung, Bild-Upload) eingeben können.
    - **Daten in Firestore speichern:** Neue Events in der `events`-Collection in Firestore speichern, verknüpft mit der `uid` des Hosts.
    - **Event-Bearbeitung:** Eine Funktion implementieren, mit der Hosts ihre eigenen Events bearbeiten können.

## 4. Ticketing & Bezahlung

- **Problem:** Der "Tickets kaufen"-Button simuliert nur die Teilnahme.
- **Lösung:**
    - **Stripe-Integration:** Stripe Checkout implementieren, um echte Zahlungen abzuwickeln.
    - **Ticket-Generierung:** Nach erfolgreicher Zahlung ein "Ticket"-Objekt in der Datenbank erstellen, das den Nutzer mit dem Event verknüpft (z.B. als QR-Code).

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

## 7. Echte Geolokalisierung für "Events in der Nähe"

- **Problem:** Die Seite `/events/nearby` zeigt statische Daten an.
- **Lösung:**
    - **Browser-Geolocation-API nutzen:** Den Nutzer um die Freigabe seines Standorts bitten.
    - **Geografische Abfrage:** Eine geografische Abfrage an die Datenbank senden (erfordert oft eine Erweiterung wie GeoFire für Firestore), um Events im Umkreis des Nutzerstandorts zu finden und anzuzeigen.

## 8. Benachrichtigungssystem

- **Problem:** Benachrichtigungen (z.B. über neue Freundschaftsanfragen oder Nachrichten) werden nur simuliert.
- **Lösung:**
    - **Firebase Cloud Messaging (FCM):** FCM integrieren, um Push-Benachrichtigungen an mobile Geräte und Browser zu senden.
    - **Benachrichtigungs-Logik:** Serverseitige Logik implementieren, die bei bestimmten Aktionen (z.B. Erhalt einer neuen Nachricht) eine Benachrichtigung auslöst.
