# Nächste Schritte & Zu implementierende Funktionen

Diese Datei listet die wichtigsten Funktionen auf, die als Nächstes implementiert werden sollten, um die Jummix-Anwendung von einer reinen Frontend-Simulation zu einer voll funktionsfähigen, datengesteuerten Anwendung zu machen.

---

## 🏆 Alle wesentlichen Funktionen sind implementiert! 🏆

Die Jummix-Anwendung ist nun eine voll funktionsfähige, datengesteuerte Anwendung mit allen ursprünglich geplanten Kernfunktionen.

<details>
<summary>Details zu den erledigten Aufgaben anzeigen</summary>

- **<del>1. Backend-Datenpersistenz (Vollständig erledigt)</del>**
- **<del>2. Echte Benutzerauthentifizierung & -verwaltung (Vollständig erledigt)</del>**
- **<del>3. Event-Management für Hosts (Vollständig erledigt)</del>**
- **<del>4. Ticketing & Bezahlung (Vollständig erledigt)</del>**
- **<del>5. Live-Chat mit WebSockets (Vollständig erledigt)</del>**
- **<del>6. Medien-Uploads (Bilder & Videos) (Vollständig erledigt)</del>**
- **<del>7. Echte Geolokalisierung für "Events in der Nähe" (Vollständig erledigt)</del>**
- **<del>8. Benachrichtigungssystem (Vollständig erledigt)</del>**

</details>

---

## 🚀 Zukünftige Feature-Anforderungen (Neu)

Hier sind die neuen Anforderungen und Ideen für die Weiterentwicklung von Jummix.

### 1. KI-gestützte Suche
- **Anforderung:** Die globale Suchleiste soll eine KI-gestützte Suche mit natürlicher Sprache ermöglichen (z.B. "ein entspanntes Jazz-Event am Wochenende").
- **UI/UX:** Das Pop-up für die Suche soll vergrößert werden und einen größeren Texteingabebereich bieten.

### 2. Event-Stories (Host-exklusiv & Monetarisierung)
- **Anforderung:** Die Story-Leiste auf der Homepage soll exklusiv für verifizierte Hosts sein.
- **Monetarisierung:** Hosts sollen dafür bezahlen können, ihre Events als Story zu bewerben. Dies stellt eine neue Einnahmequelle dar.

### 3. Dashboard-Layout & Feed
- **Anforderung:** Das Dashboard-Layout soll angepasst werden:
    - Das Leaderboard wird unter die "Meine Badges"-Sektion verschoben.
    - Der "Meine Aktivitäten"-Feed rückt an die Position des Leaderboards (oben rechts).
    - An der alten Position des Aktivitätsfeeds wird ein neuer "Feed"-Bereich für die Posts von anderen Nutzern eingeführt.

### 4. Interaktive Widgets & Animationen
- **Anforderung:** Alle Hauptbereiche auf dem Dashboard (Events, Leaderboard etc.) sollen einen "Vergrößern"-Button erhalten.
- **UI/UX:** Bei Klick auf den Button soll eine Animation das Widget vergrößern und den Nutzer zur entsprechenden Vollbild-Seite der Funktion führen (z.B. zur Leaderboard-Seite).

### 5. Story-Funktionalität (Erweitert)
- **Anforderung:** Implementierung einer umfassenden Story-Funktion für Hosts.
- **Features:**
    - **Kamera-Integration:** Direkter Zugriff auf die Gerätekamera, um Fotos für Stories aufzunehmen.
    - **Galerie-Upload:** Möglichkeit, Bilder aus der Gerätegalerie auszuwählen.
    - **Archivierung:** Erstellte Stories sollen archiviert und später erneut eingesehen werden können.

### 6. Seitenübergänge & Explore-Seite
- **Anforderung:** Ein Button auf der "Explore"-Seite soll zur "Freunde"-Seite führen.
- **UI/UX:** Dieser Übergang soll durch eine fließende Animation realisiert werden, bei der der gesamte Bildschirminhalt nach links gleitet, während der globale Header fixiert bleibt.

### 7. Erweiterte Event-Filter & Sortierung
- **Anforderung:** Die Filter- und Sortieroptionen auf der "Explore"-Seite müssen erweitert werden.
- **Neue Filter:** Datum, Uhrzeit, "Woman Only", Preis, Sprache, Interessen, Politik, Thema.
- **Neue Sortieroptionen:** Neueste zuerst, Beliebtheit, Datum (auf-/absteigend), beste Bewertung, Preis (auf-/absteigend), Entfernung.

### 8. "Leute in deiner Nähe" & Profil-Interaktion
- **Anforderung:** Eine neue Sektion "Leute in deiner Nähe" auf der Homepage.
- **Interaktion:** Bei Klick auf einen Nutzer soll man direkt zu dessen Profilseite gelangen, wo man die Posts, Events und vergangenen Stories der Person sehen kann. Von dort aus soll man die Person als Freund hinzufügen und einen Chat starten können.

### 9. Neugestaltung der "Events entdecken"-Seite
- **Anforderung:** Die Seite soll im Stil von Instagram neu gestaltet werden.
- **UI/UX:**
    - Eine Kachelansicht mit Event-Fotos in verschiedenen Layouts.
    - Eine prominente Suchleiste oben.
    - Bei Klick auf ein Event öffnet sich ein Pop-up mit Kurzinformationen auf einem abgedunkelten Hintergrund.
    - Ein "Details anzeigen"-Button im Pop-up führt zur vollständigen Event-Detailseite.

### 10. Erweiterte Freundes-Filter & Sortierung
- **Anforderung:** Die Filter- und Sortieroptionen auf der "Freunde"-Seite müssen erweitert werden.
- **Neue Filter:** Alter, Geschlecht, Sprache, Standort, nur online anzeigen, nur verifizierte Hosts.
- **Neue Sortieroptionen:** "Neu registriert" und "Am aktivsten".

### 11. Erweiterte Chat-Funktionen
- **Anforderung:** Die Chat-Funktionalität muss erweitert werden.
- **Features:**
    - **Anhänge:** Ein Button zum Anhängen von Inhalten mit den Optionen: "Foto aufnehmen", "Aus Galerie wählen", "Event teilen".
    - **Event teilen:** Ermöglicht das Senden eines gespeicherten Events an einen Chatpartner.
    - **Automatische Event-Gruppen:** Bei Teilnahme an einem Event wird der Nutzer automatisch einer Gruppe hinzugefügt. Der Host ist Admin dieser Gruppe. Alle Event-Details (Standort, Teilnehmer etc.) sind in der Gruppeninfo einsehbar.

### 12. Benachrichtigungs-Center
- **Anforderung:** Eine dedizierte Benachrichtigungs-Sektion auf der Homepage.
- **Inhalte:** Ungelesene Benachrichtigungen, Nachrichten von Freunden, eventbezogene Neuigkeiten und Erwähnungen.

### 13. Mindestteilnehmerzahl & Event-Absage (Host-Tool)
- **Anforderung:** Ein Tool für Hosts zur Berechnung der Wirtschaftlichkeit eines Events.
- **Logik:**
    - Hosts geben Ticketpreis, maximale Kapazität und ihre Ausgaben an.
    - Das System berechnet die Mindestteilnehmerzahl für ein rentables Event.
    - Wird diese Zahl nicht erreicht, wird das Event automatisch abgesagt und alle Ticketkäufer erhalten ihr Geld zurück.

### 14. Ticketing, QR-Code-Check-in & Auszahlung
- **Anforderung:** Ein umfassendes Ticketing- und Check-in-System.
- **Features:**
    - **Meine Tickets:** Nach dem Kauf wird jedem Teilnehmer ein Ticket (mit QR-Code) in seinem Account zugewiesen.
    - **Host-Scanner:** Der Host kann über die Event-Seite auf seine Kamera zugreifen, um die QR-Codes der Teilnehmer zu scannen.
    - **Check-in & Auszahlung:** Der Scan bestätigt die Anwesenheit und sichert dem Host die Auszahlung des Geldes für dieses Ticket.
    - **Auszahlungsmodell:** Der Host erhält den Gesamtbetrag aller gescannten Tickets nach Ende des Events, abzüglich einer Plattformgebühr von ca. 20%.
