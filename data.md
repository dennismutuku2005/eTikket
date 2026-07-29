# eTikket System Data Reference

This document captures the current domain entities, user roles, operations, and workflows present in the application so they can be used to design UML class diagrams, sequence diagrams, and related system documentation.

## 1. System Overview

The eTikket platform is a ticketing and event management system with three primary user-facing areas:
- Organizer dashboard for event and ticket management
- Public-facing event browsing and ticket purchasing
- Gate-staff check-in flow for ticket validation at the event entrance

## 2. Main User Roles

### 2.1 Organizer
- Manages events
- Configures payment settings
- Views sales and attendee information
- Oversees staff members
- Accesses organizer dashboard

### 2.2 Gate Staff
- Logs in to a dedicated gate-staff portal
- Scans QR codes
- Verifies tickets
- Marks tickets as used

### 2.3 Public User
- Browses events
- Registers and logs in
- Purchases tickets
- Views event details and checkout flow

## 3. Core Entities

### 3.1 User
Attributes:
- id
- name
- email
- phone
- password
- role

Responsibilities:
- Authenticates into the system
- Accesses role-specific dashboards

### 3.2 Event
Attributes:
- id
- title
- description
- date
- venue
- organizerId
- status

Responsibilities:
- Represents an event being sold or managed
- Supports organizer actions such as create, edit, view

### 3.3 Ticket
Attributes:
- id
- eventId
- attendeeName
- ticketType
- code
- status
- scannedBy
- scannedAt

Responsibilities:
- Represents a ticket purchased for an event
- Can be pending, verified, or used

### 3.4 Staff Member
Attributes:
- id
- name
- email
- phone
- password
- role
- accessLevel

Responsibilities:
- Represents a staff account used by organizers or gate staff
- Supports login and access control

### 3.5 Payment Configuration
Attributes:
- id
- organizerId
- paymentType
- paybill
- till
- accountName
- mpesaReference

Responsibilities:
- Stores payment setup information for events or organizer accounts

### 3.6 Transaction
Attributes:
- id
- eventId
- organizerId
- amount
- payerName
- mpesaCode
- status

Responsibilities:
- Captures payment activity and transaction status

## 4. Current System Operations

### 4.1 Authentication and Access
- User logs in with email/phone and password
- System validates credentials
- Session is stored in the browser
- User is redirected to their role-based home page

Operations:
- loginUser()
- logoutUser()
- validateSession()
- redirectToRoleHome()

### 4.2 Organizer Operations
- Organizer views dashboard home
- Organizer manages events
- Organizer views payments
- Organizer configures MPESA payment settings
- Organizer manages staff members
- Organizer views attendee analytics
- Organizer reviews ticket sales and revenue
- Organizer monitors ticket usage and check-in status

Operations:
- createEvent()
- editEvent()
- viewEventDetails()
- viewPayments()
- savePaymentConfiguration()
- manageStaff()
- viewAttendeeAnalytics()
- viewSalesSummary()
- viewTicketUsageReport()

### 4.3 Public User Operations
- Public user browses available events
- Public user views event details
- Public user registers
- Public user logs in
- Public user selects tickets
- Public user checks out and purchases tickets
- Public user receives confirmation of purchase
- Public user views purchased ticket details
- Public user gets a QR code for entry
- Public user can access ticket history

Operations:
- browseEvents()
- viewEvent()
- registerUser()
- loginUser()
- selectTicketType()
- purchaseTicket()
- checkout()
- confirmPurchase()
- viewTicketReceipt()
- generateQRCode()
- viewTicketHistory()

### 4.4 Gate Staff Operations
- Gate staff logs in at /gatestaff/login
- Gate staff reaches scanner page at /gatestaff/now
- Gate staff opens camera scanner
- Gate staff scans QR code
- System looks up corresponding ticket
- Gate staff verifies and marks ticket as used
- Gate staff logs out
- Gate staff can see ticket holder details before approval
- Gate staff can reject or flag invalid tickets

Operations:
- gateStaffLogin()
- openCameraScanner()
- scanQRCode()
- lookupTicket()
- viewTicketDetails()
- verifyTicket()
- markTicketUsed()
- flagInvalidTicket()
- logoutGateStaff()

## 5. Current Workflow Examples

### 5.1 Login Flow
1. User enters email/phone and password
2. System validates against known demo users
3. Session is stored
4. User is redirected to their role page

### 5.2 Event Management Flow
1. Organizer creates or edits an event
2. Event is stored in the organizer view
3. Public users can view and purchase tickets for the event

### 5.3 Ticket Verification Flow
1. Gate staff logs in
2. Gate staff opens camera scanner
3. QR code is scanned
4. Ticket details are fetched from demo ticket data
5. Ticket is verified and marked as used

### 5.4 Payment Configuration Flow
1. Organizer opens payment settings page
2. Enters MPESA values
3. Settings are saved locally in browser storage
4. Payment information is displayed in organizer UI

## 6. Suggested Class Diagram Mapping

### 6.1 Core Classes
- User
- Organizer
- GateStaff
- Event
- Ticket
- StaffMember
- PaymentConfiguration
- Transaction
- Session

### 6.2 Relationships
- Organizer manages many Events
- Event has many Tickets
- Ticket belongs to one Event
- User may act as Organizer, Admin, or GateStaff depending on role
- PaymentConfiguration belongs to an Organizer
- Transaction relates to an Event and Organizer
- StaffMember can be linked to an Organizer or Gate operation

## 7. Suggested Sequence Diagram Mapping

### 7.1 Login Sequence
- User -> AuthenticationService: submit credentials
- AuthenticationService -> User: validate role
- AuthenticationService -> SessionStore: create session
- SessionStore -> User: redirect to role-based dashboard

### 7.2 Ticket Verification Sequence
- GateStaff -> ScannerUI: open camera
- ScannerUI -> QRReader: read QR payload
- QRReader -> TicketService: lookup ticket
- TicketService -> ScannerUI: return ticket details
- GateStaff -> TicketService: verify ticket
- TicketService -> Ticket: update status to verified/used

## 8. Notes for UML Design

Use this document as a reference for:
- Class diagrams: entities, attributes, and relationships
- Use case diagrams: organizer, admin, gate staff, public user
- Sequence diagrams: login, ticket verification, payment setup
- Activity diagrams: event management, ticket scanning

## 9. Demo Data Notes

The current implementation uses demo or mock data for:
- Users and credentials
- Tickets and statuses
- Payment configuration values
- Staff records

This makes it suitable for prototyping and diagramming, but not yet full production persistence.
