

# AI Classroom Attendance System — Implementation Plan

## Design System
- Light theme: white + soft gray backgrounds
- Accents: Navy blue (primary), teal, green (success), yellow (warning), red (error)
- Rounded corners, minimal shadows, professional typography
- Clean SaaS enterprise dashboard aesthetic

## Pages & Flow

### 1. Login Page
- Clean centered login card with email/password fields
- Product branding at top
- "Sign In" button, minimal layout

### 2. Teacher Dashboard
- Stats cards: Total classes, Average attendance %, Pending confirmations
- Recent sessions table with date, class, attendance %
- Prominent "Start New Session" button
- Clean grid layout

### 3. Start Attendance Session
- Cascading dropdowns: Academic Year → Division → Batch → Classroom
- Realistic mappings (FY/SY/TY → A-D → Batch 1-3 → Room 2211-2216)
- "Start Session" button activates after all selections made

### 4. Live Classroom Map (Core Page)
- **Left: Classroom Map** — Teacher's POV orientation
  - Phase 1: Empty grid appears
  - Phase 2: Desk rectangles load in (rounded corners)
  - Phase 3: Student squares appear inside desks (neutral gray)
  - Phase 4: After ~3 seconds, colors reveal (green = identified, yellow/red = unidentified)
  - Roll numbers appear on identified students only
  - ~15-20 desks with mix of identified/unidentified students
- **Right: Details Panel**
  - Shows selected student info on click
  - Identified: Name, Roll No, SRN, confidence score (subtle), status, confirm button
  - Unidentified: "Unknown Student" label, text input for roll number, save button
- **Bottom: Summary Bar**
  - Total desks, identified, unidentified, confirmed count, corrections, attendance %
- "Finalize Attendance" button

### 5. Attendance Review & Confirmation
- List/grid of all students with their status
- Ability to make final corrections before confirming
- "Confirm & Submit" button

### 6. Session Summary
- Final stats: desks detected, students identified, unresolved cases, manual corrections, attendance %, session status "Completed"
- Clean summary card layout
- "Back to Dashboard" button

## Simulation Logic
- All done with timeouts and state transitions — no backend needed
- Dummy data with 15-20 diverse students using the provided names, roll numbers, and SRNs
- 2-3 students marked as unidentified for teacher interaction demo
- Confidence scores between 85-99% for identified students

## Navigation
- Login → Dashboard → Start Session → Live Map → Review → Summary
- Sidebar or top nav for returning to dashboard

