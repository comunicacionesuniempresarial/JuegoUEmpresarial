# Admin Panel Specification

## Purpose
The admin panel provides authenticated administrators with tools to view, search, and export game registration data.

## Requirements

### Requirement: Authentication
The system MUST require authentication to access the admin panel.

#### Scenario: Login flow
- GIVEN the user navigates to the admin panel
- WHEN not authenticated
- THEN the system redirects to the login page
- AND the login form accepts email and password

#### Scenario: Session management
- GIVEN an admin is logged in
- WHEN 30 minutes of inactivity pass
- THEN the session expires
- AND the user is redirected to login

### Requirement: Dashboard Display
The system SHALL display an overview of registration statistics.

#### Scenario: Dashboard load
- GIVEN an admin is authenticated
- WHEN the dashboard loads
- THEN registration statistics are displayed
- AND data includes counts by game type

### Requirement: Data Table
The system MUST display registrations in a searchable, filterable table.

#### Scenario: Table display
- GIVEN the admin is on the data view
- WHEN the table loads
- THEN all registrations are displayed
- AND columns include name, phone, game, result, date

#### Scenario: Search functionality
- GIVEN the admin is viewing the data table
- WHEN the admin enters a search term
- THEN the table filters to show matching records

#### Scenario: Filter by game
- GIVEN the admin is viewing the data table
- WHEN the admin selects a game filter
- THEN only records for that game are displayed

### Requirement: Data Export
The system MUST support exporting data in multiple formats.

#### Scenario: CSV export
- GIVEN the admin is on the data view
- WHEN the admin clicks "Export CSV"
- THEN a CSV file downloads with all filtered records

#### Scenario: PDF export
- GIVEN the admin is on the data view
- WHEN the admin clicks "Export PDF"
- THEN a PDF document is generated using jsPDF
- AND the PDF contains the filtered records

### Requirement: Audit Logging
The system SHALL log all administrative actions.

#### Scenario: Action logging
- GIVEN an admin performs any action
- WHEN the action completes
- THEN the action is recorded in the audit_log table
- AND the log includes user_id, action, timestamp