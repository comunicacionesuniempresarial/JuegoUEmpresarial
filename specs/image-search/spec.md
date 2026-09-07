# Image Search (Búsqueda) Specification

## Purpose
The Búsqueda game challenges users to find Stuttgart hidden among race car images, tracking their search time with a visible timer.

## Requirements

### Requirement: Image Display
The system MUST display race car images for the search challenge.

#### Scenario: Image grid setup
- GIVEN the user navigates to the Búsqueda page
- WHEN the page loads
- THEN 7 race car images are displayed
- AND Stuttgart is randomly placed among the images
- AND each image occupies approximately 80% of the viewport

### Requirement: Timer Functionality
The system SHALL track and display elapsed time during the search.

#### Scenario: Timer start
- GIVEN the user loads the Búsqueda page
- WHEN the page finishes loading
- THEN the timer starts automatically
- AND the timer displays in mm:ss format

#### Scenario: Timer stop
- GIVEN the timer is running
- WHEN the user clicks the "¡LO ENCONTRÉ!!" button
- THEN the timer stops immediately
- AND the elapsed time is displayed in a result popup

### Requirement: Search Completion
The system MUST provide feedback when the user finds Stuttgart.

#### Scenario: Finding Stuttgart
- GIVEN the user is searching for Stuttgart
- WHEN the user clicks on the correct image
- THEN the timer stops
- AND a popup shows the elapsed time
- AND Studgard displays "¡Lo encontraste!" message

### Requirement: Studgard Integration
The system SHOULD provide contextual Studgard companion messages.

#### Scenario: Initial instruction
- GIVEN the user loads the Búsqueda page
- WHEN the page renders
- THEN Studgard displays "¡Busca a Stuttgart!" speech bubble

#### Scenario: During search
- GIVEN the timer is running
- WHEN the user is actively searching
- THEN Studgard displays "¡Rápido, el tiempo corre!" speech bubble