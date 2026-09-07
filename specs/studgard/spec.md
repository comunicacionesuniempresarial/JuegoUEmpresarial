# Studgard Companion Specification

## Purpose
Studgard is the university mascot (a dog) that provides friendly guidance and encouragement throughout the user experience.

## Requirements

### Requirement: Responsive Sizing
The system MUST adapt Studgard's size based on viewport.

#### Scenario: Desktop size
- GIVEN the user is on a desktop viewport (>1024px)
- WHEN Studgard renders
- THEN Studgard displays at 80px height

#### Scenario: Tablet size
- GIVEN the user is on a tablet viewport (768-1024px)
- WHEN Studgard renders
- THEN Studgard displays at 60px height

#### Scenario: Mobile size
- GIVEN the user is on a mobile viewport (<768px)
- WHEN Studgard renders
- THEN Studgard displays at 40px height

### Requirement: Speech Bubbles
The system SHALL display contextual messages via speech bubbles.

#### Scenario: Instruction display
- GIVEN Studgard is visible on a game page
- WHEN the page loads
- THEN a speech bubble appears with context-appropriate instructions
- AND the bubble is positioned near Studgard

### Requirement: Auto-Hide Behavior
The system SHOULD automatically hide Studgard after a delay.

#### Scenario: Auto-hide timer
- GIVEN Studgard has displayed a message
- WHEN 5 seconds elapse
- THEN Studgard and the speech bubble fade out
- AND the element is removed from view

### Requirement: Positioning
The system MUST position Studgard unobtrusively.

#### Scenario: Corner placement
- GIVEN Studgard is active on any page
- WHEN the component renders
- THEN Studgard is positioned in the bottom-right corner
- AND Studgard does not overlap main content

### Requirement: Pose Variations
The system SHALL support multiple Studgard poses.

#### Scenario: Pose selection
- GIVEN Studgard needs to display
- WHEN the pose is determined by context
- THEN one of three poses is shown: open, pointing, or thumbs-up
- AND the pose matches the current game state