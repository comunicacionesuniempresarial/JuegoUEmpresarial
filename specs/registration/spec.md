# Registration Specification

## Purpose
The registration form captures user data with LGPD compliance, storing information securely in Supabase.

## Requirements

### Requirement: Modal Display
The system MUST display the registration form in a modal overlay.

#### Scenario: Modal appearance
- GIVEN the user triggers the registration form
- WHEN the modal opens
- THEN the background applies blur(10px) effect
- AND the modal is centered on screen
- AND the form fields are clearly visible

### Requirement: Form Validation
The system SHALL validate all form inputs before submission.

#### Scenario: Name validation
- GIVEN the registration form is open
- WHEN the user enters a name with fewer than 2 characters
- THEN the form shows a validation error
- AND the submit button remains disabled

#### Scenario: Phone validation
- GIVEN the registration form is open
- WHEN the user enters a phone number not matching Colombian format (+57XXXXXXXXX)
- THEN the form shows a validation error
- AND the submit button remains disabled

### Requirement: Consent Checkbox
The system MUST require explicit consent before form submission.

#### Scenario: Consent required
- GIVEN the registration form is open
- WHEN the user has not checked the consent checkbox
- THEN the "REGISTRAR" button is disabled

#### Scenario: Consent given
- GIVEN the registration form is open
- WHEN the user checks the consent checkbox
- THEN the "REGISTRAR" button becomes enabled

### Requirement: Data Submission
The system SHALL securely submit registration data to Supabase.

#### Scenario: Successful registration
- GIVEN the form is valid and consent is given
- WHEN the user clicks "REGISTRAR"
- THEN the data is sent to Supabase via INSERT
- AND a success toast "¡Registrado!" appears
- AND the modal closes

### Requirement: Studgard Integration
The system SHOULD provide Studgard companion guidance.

#### Scenario: Registration instruction
- GIVEN the registration modal is open
- WHEN the form displays
- THEN Studgard shows "¡Registra tus datos!" speech bubble