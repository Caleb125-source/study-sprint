# Study Sprint

Study Sprint is a React-based productivity web application designed to help students manage tasks, track study sessions, and stay focused using a Pomodoro-style timer.

It includes:

Task planning

Focus timer

Weekly progress tracking

Authentication system

Global settings (theme + durations)

Session logging

# Setup Instructions
Clone the repository
git clone <your-github-repo-link>
cd study-sprint

Install dependencies
npm install

Start the mock backend (JSON Server)
This project uses json-server with db.json as a mock backend.
npx json-server --watch db.json --port 3001

You should see:
JSON Server started on PORT :3001
Endpoints:
http://localhost:3001/settings
http://localhost:3001/users
http://localhost:3001/tasks
http://localhost:3001/sessions

Start the React app
Open a second terminal and run:
npm run dev

Then open in browser:
http://localhost:5173




# Planner Component

A React-based task management component for organizing and tracking tasks with filtering capabilities.

# Features

Task Creation: Add new tasks with title, subject, due date, priority, and status
Task Editing: Edit existing tasks inline with a clean form interface
Task Filtering: Filter tasks by status, priority, and subject
Task Management: Mark tasks as done or delete them
Responsive Design: Clean, organized layout with modular CSS

# Component Tree
study-sprint/
├─ node_modules/
├─ public/
│
├─ db.json
├─ .gitignore
├─ eslint.config.js
├─ index.html          
├─ package.json
├─ package-lock.json
├─ vite.config.js
│
└─ src/
   ├─ assets/
   │
   ├─ auth/
   │   ├─ AuthContext.jsx
   │   └─ ProtectedRoute.jsx
   │
   ├─ components/
   │   ├─ Feature.jsx
   │   ├─ Layout.jsx
   │   ├─ LogoutButton.jsx
   │   ├─ Navbar.jsx
   │   ├─ PlannerPage.jsx
   │   └─ TimerPage.jsx
   │
   ├─ context/
   │   ├─ SessionsContext.jsx
   │   └─ SettingsContext.jsx
   │
   ├─ pages/
   │   ├─ About.jsx
   │   ├─ Dashboard.jsx
   │   ├─ FeaturesPage.jsx
   │   ├─ FeaturesPage.test.jsx
   │   ├─ LandingHomePage.jsx
   │   ├─ LoginPage.jsx
   │   ├─ ProgressPage.jsx
   │   ├─ SettingsPage.jsx
   │   └─ SignupPage.jsx
   │
   ├─ styles/
   │   ├─ about.css
   │   ├─ dashboard.css
   │   ├─ FeaturesPage.module.css
   │   ├─ LandingHomePage.module.css
   │   ├─ LoginPage.module.css
   │   ├─ PlannerPage.module.css
   │   ├─ ProgressPage.module.css
   │   ├─ SettingsPage.module.css
   │   ├─ SignupPage.module.css
   │   └─ TimerPage.module.css
   │
   ├─ tests/
   │   ├─ About.test.jsx
   │   ├─ Dashboard.test.jsx
   │   ├─ LoginPage.test.jsx
   │   ├─ PlannerPage.test.jsx
   │   ├─ ProgressPage.test.jsx
   │   ├─ SettingsPage.test.jsx
   │   ├─ SignupPage.test.jsx
   │   ├─ TimerPage.test.jsx
   │   ├─ setup.js
   │   └─ SetupTests.js
   │
   ├─ App.jsx
   ├─ index.css
   └─ main.jsx


# Component Structure

# Main Components

# PlannerPage

The main container component that manages the overall planner interface.

# Props:

tasks (array): Array of task objects
addTask (function): Function to add a new task
updateTask (function): Function to update an existing task
deleteTask (function): Function to delete a task

# TaskForm

Form component for adding new tasks.

# Props:

addTask (function): Callback function to add a task

# Fields:

Title (required)
Subject (required)
Due Date (required, min: today)
Priority (required): Low, Medium, High
Status (required): To-Do, In Progress

# TaskFilters

Filter component to narrow down displayed tasks.

# Props:

filters (object): Current filter state
setFilters (function): Function to update filters
tasks (array): All tasks (used to generate subject options)

# Filter Options:

Status: All, To-Do, In Progress, Done
Priority: All, Low, Medium, High
Subject: Dynamically generated from existing tasks

# TaskItem

Individual task display and edit component.

# Props:

task (object): Task data
updateTask (function): Function to update the task
deleteTask (function): Function to delete the task

# Features:

Toggle between view and edit modes
Mark task as done
Edit all task properties
Delete task

# TaskList

Container component that renders all filtered tasks.

# Props:

tasks (array): Filtered tasks to display
updateTask (function): Function to update tasks
deleteTask (function): Function to delete tasks

# Styling

The component uses CSS modules imported from ../styles/PlannerPage.module.css. Required CSS classes:

Layout: page, pageHead, pageTitle, pageSubtitle, plannerGrid, leftCol
Cards: card, cardHeader, cardTitle
Forms: field, label, input, select, twoCol
Buttons: btn, btnPrimary, btnDanger, primary
Tasks: taskRow, taskMain, taskTitle, taskMeta, taskSide, taskBtns
Utilities: stack, pill, muted

# Performance Optimizations

Uses useMemo for filtering tasks to avoid unnecessary recalculations
Uses useMemo for generating subject filter options
Controlled component pattern for optimal re-rendering

# Validation

All form fields are required
Empty task titles are prevented
Due dates cannot be set in the past
Form resets after successful submission

# Future Enhancements

Add task search functionality
Implement task sorting options
Add task categories/tags
Include task descriptions
Add task completion tracking/statistics
Implement local storage persistence
Add task reminders/notifications
Support for recurring tasks

# TimerPage Component
A Pomodoro-style timer component for managing focus sessions and breaks.

# Overview
TimerPage is a React component that implements a customizable timer for productivity sessions. It supports three modes (Focus, Short Break, Long Break), task tracking, and session logging.
Features

# Three Timer Modes

Focus: Default 25 minutes for work sessions
Short Break: Default 5 minutes for short breaks
Long Break: Default 15 minutes for longer breaks


# Timer Controls

Start/Pause: Begin or pause the countdown
Reset: Reset timer to current mode's duration
Skip: Skip current session and switch to next mode


# Task Tracking

Select a task to associate with focus sessions
Sessions are logged with task information


# Session Logging

Automatically logs completed focus sessions
Records session start time, duration, and associated task
Skipped sessions are logged with 0 minutes


# Dependencies

React (hooks: useState, useEffect, useRef, useMemo)
SettingsContext (custom context for timer durations)
TimerPage.module.css (component styles)


# State Management
# Local State

modeKey: Current timer mode ('Focus' | 'Short Break' | 'Long Break')
running: Boolean indicating if timer is active
selectedTaskId: ID of selected task (empty string if none)
secondsLeft: Remaining time in seconds
message: Status message to display

# Effects

Mode Change Effect: Resets timer when mode or settings change
Timer Effect: Runs countdown interval when timer is active
Completion Effect: Handles session completion logic

# Behavior
# Timer Flow

Starting: Click Start → timer begins countdown
Pausing: Click Pause → timer stops but retains current time
Resetting: Click Reset → timer returns to mode's default duration
Completing: Timer reaches 0 → shows completion message, logs session (Focus only)

# Skip Behavior

From Focus: Switches to Short Break, logs 0-minute session
From Break: Switches to Focus, no session logged

# Session Logging
Sessions are only logged for Focus mode in two cases:

Timer naturally completes (full duration)
Timer is skipped (0 minutes)


# Styling
The component uses CSS modules with the following main classes:

page: Main container
card: Card container
time: Large timer display
btn: Button styles
primary: Primary button variant
ghost: Ghost button variant
pill: Mode indicator badge
muted: Muted text

# Testing
Comprehensive test suite covers:

# Initial rendering
Timer controls (start, pause, reset)
Mode switching
Task selection
Session completion
Skip functionality
Time formatting

# Run tests with:
bashnpm test


## Custom Hooks (Context Hooks)

This project uses React Context + custom hooks to keep global app state clean and reusable.  
Instead of passing props through many components, each context exposes a custom hook that any component can call.

---

### useAuth() (Authentication Hook)

**File:** src/auth/AuthContext.jsx

useAuth() gives components access to authentication state and actions:
- user → the currently logged-in user (or null if logged out)
- isBooting → prevents route guards from running before localStorage is checked
- login({ email, password }) → logs in by checking db.json users
- signup({ name, email, password }) → creates a new user in db.json
- logout() → clears user session

**Why it matters:**  
It centralizes login/signup/logout and keeps user session persistent using localStorage.

Used by:
- LoginPage.jsx, SignupPage.jsx
- ProtectedRoute.jsx
- Navbar.jsx / LogoutButton.jsx

---

### useSettings() (App Settings Hook)

**File:** src/context/SettingsContext.jsx

useSettings() manages global study settings:
- theme (light / dark)
- focus duration
- short break duration
- long break duration

It loads settings once from db.json and auto-saves when values change (debounced).

**Why it matters:**  
All pages/components read the same settings without prop-drilling, and the theme is applied globally using a data-theme attribute.

Used by:
- TimerPage.jsx (for mode durations)
- SettingsPage.jsx (where the user edits settings)

---

### useSessions() (Study Sessions Hook)

**File:** src/context/SessionsContext.jsx

useSessions() stores and manages study sessions (focus sessions + skipped sessions):
- sessions → all sessions for the logged-in user
- addSession({ startedAt, minutes, taskId }) → saves a new session to db.json
- deleteSession(id) → deletes one session
- clearSessions() → placeholder for clearing sessions

Sessions are saved with a **local date string** (YYYY-MM-DD) to avoid timezone shifting.

**Why it matters:**  
It allows the Timer page to record sessions and the Progress page to compute weekly totals, streaks, and recent sessions.

Used by:
- TimerPage.jsx (records sessions)
- ProgressPage.jsx (reads sessions & calculates stats)

---

## Route Guard (Not a Hook but uses useAuth)

**File:** src/auth/ProtectedRoute.jsx

ProtectedRoute prevents users from accessing private routes unless logged in.  
If the app is still booting, it shows a loading message.  
If the user is not logged in, it redirects to /login.


