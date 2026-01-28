# Planner Component

A React-based task management component for organizing and tracking tasks with filtering capabilities.

# Features

Task Creation: Add new tasks with title, subject, due date, priority, and status
Task Editing: Edit existing tasks inline with a clean form interface
Task Filtering: Filter tasks by status, priority, and subject
Task Management: Mark tasks as done or delete them
Responsive Design: Clean, organized layout with modular CSS

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

