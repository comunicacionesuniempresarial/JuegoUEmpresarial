# Landing Page Specification

## Purpose
The landing page serves as the main entry point for the "¿Dónde Está Sttutgart?" game, providing a split-screen hero experience that directs users to either the Ruleta or Búsqueda game.

## Requirements

### Requirement: Hero Split-Screen Layout
The system MUST display a vertical split-screen hero section occupying 100% of the viewport.

#### Scenario: Default layout display
- GIVEN the user loads the landing page
- WHEN the page renders
- THEN the screen is divided vertically into two equal halves (50/50)
- AND the left half displays Studgard thumbs-up image
- AND the right half displays Studgard confused image

### Requirement: Brand Identity
The system SHALL maintain Uniempresarial brand consistency throughout the landing page.

#### Scenario: Logo placement
- GIVEN the user is on the landing page
- WHEN the page loads
- THEN the Uniempresarial logo appears in the header
- AND the Uniempresarial logo appears in the footer
- AND both header and footer have white background

### Requirement: Navigation Actions
The system MUST provide clear navigation to both games via action buttons.

#### Scenario: Game selection - Left side
- GIVEN the user is on the landing page
- WHEN the user clicks the "JUGAR" button on the left half
- THEN the system redirects to `/ruleta` route

#### Scenario: Game selection - Right side
- GIVEN the user is on the landing page
- WHEN the user clicks the "JUGAR" button on the right half
- THEN the system redirects to `/busqueda` route

### Requirement: Visual Gradients
The system SHOULD apply gradient backgrounds to each half for visual distinction.

#### Scenario: Gradient application
- GIVEN the user is on the landing page
- WHEN the page renders
- THEN the left half displays a blue-to-purple gradient
- AND the right half displays a red-to-yellow gradient

### Requirement: Admin Access
The system MAY provide a subtle admin access point.

#### Scenario: Admin icon visibility
- GIVEN the user is on the landing page
- WHEN the navigation bar renders
- THEN the admin icon is visible at 0.3 opacity
- AND clicking the icon navigates to the admin panel