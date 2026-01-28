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