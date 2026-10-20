# Image Search (Búsqueda) Specification

## Purpose

The Búsqueda game challenges users to find Stuttgart hidden in a detailed
illustration, tracking their search time with a visible timer.

## Requirements

### Requirement: Image Display
The system MUST display one sheet illustration at a time for the search challenge.

#### Scenario: Sheet setup
- GIVEN the user navigates to the Búsqueda page
- WHEN the page loads
- THEN a single sheet illustration is displayed
- AND Stuttgart is hidden somewhere inside that illustration
- AND the sheet fills the available board area
- AND the sheet can be panned when it is wider than the board

#### Scenario: Random sheet per round
- GIVEN the user finishes a round
- WHEN a new round starts
- THEN the system picks a different random sheet out of the 7 available
- AND the new round restarts the countdown

### Requirement: Magnifier
The system SHALL provide a magnifier to switch between the detail view and the full-sheet overview.

#### Scenario: Detail view (default)
- GIVEN the player is searching
- WHEN the sheet is displayed
- THEN the sheet fills the board height
- AND the player can pan the sheet to scan the whole illustration

#### Scenario: Full-sheet overview
- GIVEN the player activates the magnifier
- WHEN the overview is displayed
- THEN the complete sheet is visible at once, centred on the board
- AND activating the magnifier again returns to the detail view

### Requirement: Countdown
The system MUST run a countdown before the search timer starts.

#### Scenario: Countdown display
- GIVEN the user loads the Búsqueda page
- WHEN the page renders
- THEN a countdown from 5 to 1 is displayed over the sheet
- AND the "¡LO ENCONTRÉ!" button is disabled while the countdown runs

#### Scenario: Timer start
- GIVEN the countdown reaches zero
- WHEN the countdown finishes
- THEN the search timer starts
- AND the timer displays in mm:ss format

### Requirement: Timer Functionality
The system SHALL track and display elapsed time during the search.

#### Scenario: Timer stop
- GIVEN the timer is running
- WHEN the user presses the "¡LO ENCONTRÉ!" button
- THEN the timer stops immediately
- AND the elapsed time is displayed in the result panel

### Requirement: Search Completion
The system MUST provide feedback when the user finds Stuttgart.

#### Scenario: Claiming the find
- GIVEN the user is searching for Stuttgart
- WHEN the user presses the "¡LO ENCONTRÉ!" button
- THEN the timer stops
- AND a panel shows the elapsed time
- AND Studgard displays the "¡Encontraste a Stuttgart!" message

### Requirement: Registration
The system MUST let the user register the result of a finished round.

#### Scenario: Registration modal
- GIVEN the player finished a round
- WHEN the player presses "Registrar"
- THEN the registration modal opens with the elapsed time as the result
- AND a successful registration starts a new round with a new random sheet

### Requirement: Studgard Integration
The system SHOULD provide contextual Studgard companion messages.

#### Scenario: Initial instruction
- GIVEN the user loads the Búsqueda page
- WHEN the page renders
- THEN Studgard displays the "¡Busca a Stuttgart!" speech bubble

#### Scenario: During search
- GIVEN the timer is running
- WHEN the player is actively searching
- THEN Studgard displays the "¡Rápido, el tiempo corre!" speech bubble
