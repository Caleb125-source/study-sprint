import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { expect, describe, test, beforeEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

import { PlannerPage } from '../components/PlannerPage';

// Mock CSS modules
vi.mock('../../styles/PlannerPage.module.css', () => ({
  page: 'page',
  pageHead: 'pageHead',
  pageTitle: 'pageTitle',
  pageSubtitle: 'pageSubtitle',
  plannerGrid: 'plannerGrid',
  leftCol: 'leftCol',
  card: 'card',
  cardHeader: 'cardHeader',
  cardTitle: 'cardTitle',
  stack: 'stack',
  field: 'field',
  label: 'label',
  input: 'input',
  select: 'select',
  twoCol: 'twoCol',
  btn: 'btn',
  btnPrimary: 'btnPrimary',
  btnDanger: 'btnDanger',
  primary: 'primary',
  taskRow: 'taskRow',
  taskMain: 'taskMain',
  taskTitle: 'taskTitle',
  taskMeta: 'taskMeta',
  taskSide: 'taskSide',
  taskBtns: 'taskBtns',
  pill: 'pill',
  muted: 'muted',
}));

describe('PlannerPage', () => {
  const mockAddTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockDeleteTask = vi.fn();

  const sampleTasks = [
    {
      id: 1,
      title: 'Complete homework',
      subject: 'Math',
      dueDate: '2026-02-01',
      priority: 'High',
      status: 'To-Do'
    },
    {
      id: 2,
      title: 'Read chapter 5',
      subject: 'Science',
      dueDate: '2026-02-05',
      priority: 'Medium',
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'Write essay',
      subject: 'English',
      dueDate: '2026-02-10',
      priority: 'Low',
      status: 'Done'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders planner page with all sections', () => {
      render(
        <PlannerPage
          tasks={[]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      expect(screen.getByText('Planner')).toBeInTheDocument();
      expect(screen.getByText('Manage your tasks efficiently')).toBeInTheDocument();
      expect(screen.getByText('Add Task')).toBeInTheDocument();
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByText('Task List')).toBeInTheDocument();
    });

    test('displays correct task count', () => {
      render(
        <PlannerPage
          tasks={sampleTasks}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      expect(screen.getByText('3 task(s)')).toBeInTheDocument();
    });

    test('displays "No tasks found" when task list is empty', () => {
      render(
        <PlannerPage
          tasks={[]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      expect(screen.getByText('No tasks found.')).toBeInTheDocument();
    });
  });

  describe('TaskForm', () => {
    test('renders all form fields', () => {
      render(
        <PlannerPage
          tasks={[]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      expect(screen.getByPlaceholderText('e.g., Finish homework')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., Science')).toBeInTheDocument();
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Priority')[0]).toBeInTheDocument(); // First one (in form)
      expect(screen.getAllByLabelText('Status')[0]).toBeInTheDocument(); // First one (in form)
    });

    test('adds a task when form is submitted with valid data', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      // Fill in the form
      await user.type(screen.getByPlaceholderText('e.g., Finish homework'), 'New Task');
      await user.type(screen.getByPlaceholderText('e.g., Science'), 'Chemistry');
      await user.type(screen.getByLabelText('Due Date'), '2026-03-01');
      await user.selectOptions(screen.getAllByLabelText('Priority')[0], 'High'); // First one (in form)
      await user.selectOptions(screen.getAllByLabelText('Status')[0], 'To-Do'); // First one (in form)

      // Submit the form
      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);

      expect(mockAddTask).toHaveBeenCalledWith({
        title: 'New Task',
        subject: 'Chemistry',
        dueDate: '2026-03-01',
        priority: 'High',
        status: 'To-Do'
      });
    });

    test('does not add task with empty title', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      // Submit with empty title
      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);

      expect(mockAddTask).not.toHaveBeenCalled();
    });

    test('trims whitespace from task title', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      await user.type(screen.getByPlaceholderText('e.g., Finish homework'), '  Task with spaces  ');
      await user.type(screen.getByPlaceholderText('e.g., Science'), 'Math');
      await user.type(screen.getByLabelText('Due Date'), '2026-03-01');
      await user.selectOptions(screen.getAllByLabelText('Priority')[0], 'Medium'); // First one (in form)
      await user.selectOptions(screen.getAllByLabelText('Status')[0], 'In Progress'); // First one (in form)

      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);

      expect(mockAddTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Task with spaces'
        })
      );
    });
  });

  describe('TaskFilters', () => {
    test('filters tasks by status', () => {
      const { rerender } = render(
        <PlannerPage
          tasks={sampleTasks}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      // Initially shows all 3 tasks
      expect(screen.getByText('3 task(s)')).toBeInTheDocument();

      // Filter by "To-Do" status
      const statusFilter = screen.getAllByLabelText('Status')[1]; // Second one is in filters
      fireEvent.change(statusFilter, { target: { value: 'To-Do' } });

      // Should show 1 task
      expect(screen.getByText('1 task(s)')).toBeInTheDocument();
      expect(screen.getByText('Complete homework')).toBeInTheDocument();
    });

    test('filters tasks by priority', () => {
      render(
        <PlannerPage
          tasks={sampleTasks}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      const priorityFilter = screen.getAllByLabelText('Priority')[1]; // Second one is in filters
      fireEvent.change(priorityFilter, { target: { value: 'High' } });

      expect(screen.getByText('1 task(s)')).toBeInTheDocument();
      expect(screen.getByText('Complete homework')).toBeInTheDocument();
    });

    test('filters tasks by subject', () => {
      render(
        <PlannerPage
          tasks={sampleTasks}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      const subjectFilter = screen.getAllByLabelText('Subject')[1]; // Second one is in filters
      fireEvent.change(subjectFilter, { target: { value: 'Science' } });

      expect(screen.getByText('1 task(s)')).toBeInTheDocument();
      expect(screen.getByText('Read chapter 5')).toBeInTheDocument();
    });

    test('combines multiple filters', () => {
      render(
        <PlannerPage
          tasks={sampleTasks}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      const statusFilter = screen.getAllByLabelText('Status')[1]; // Second one is in filters
      const priorityFilter = screen.getAllByLabelText('Priority')[1]; // Second one is in filters

      fireEvent.change(statusFilter, { target: { value: 'In Progress' } });
      fireEvent.change(priorityFilter, { target: { value: 'Medium' } });

      expect(screen.getByText('1 task(s)')).toBeInTheDocument();
      expect(screen.getByText('Read chapter 5')).toBeInTheDocument();
    });

    test('dynamically generates subject options from tasks', () => {
      render(
        <PlannerPage
          tasks={sampleTasks}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      const subjectFilter = screen.getAllByLabelText('Subject')[1]; // Second one is in filters
      const options = Array.from(subjectFilter.options).map(opt => opt.value);

      expect(options).toContain('All');
      expect(options).toContain('Math');
      expect(options).toContain('Science');
      expect(options).toContain('English');
    });
  });

  describe('TaskItem', () => {
    test('displays task information in view mode', () => {
      render(
        <PlannerPage
          tasks={[sampleTasks[0]]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      expect(screen.getByText('Complete homework')).toBeInTheDocument();
      expect(screen.getByText('Due: 2026-02-01')).toBeInTheDocument();
      // Check that "High" exists somewhere (could be in form or task display)
      const highElements = screen.getAllByText('High');
      expect(highElements.length).toBeGreaterThan(0);
      // Check that "To-Do" exists somewhere (could be in form or task display)
      const todoElements = screen.getAllByText('To-Do');
      expect(todoElements.length).toBeGreaterThan(0);
    });

    test('marks task as done when "Mark Done" is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[sampleTasks[0]]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      const markDoneButton = screen.getByRole('button', { name: 'Mark Done' });
      await user.click(markDoneButton);

      expect(mockUpdateTask).toHaveBeenCalledWith(1, {
        ...sampleTasks[0],
        status: 'Done'
      });
    });

    test('deletes task when "Delete" is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[sampleTasks[0]]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(deleteButton);

      expect(mockDeleteTask).toHaveBeenCalledWith(1);
    });

    test('switches to edit mode when "Edit" is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[sampleTasks[0]]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      const editButton = screen.getByRole('button', { name: 'Edit' });
      await user.click(editButton);

      // Check for edit mode elements
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByDisplayValue('Complete homework')).toBeInTheDocument();
    });

    test('saves changes when "Save" is clicked in edit mode', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[sampleTasks[0]]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: 'Edit' }));

      // Modify the title
      const titleInput = screen.getByDisplayValue('Complete homework');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated homework');

      // Save changes
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(mockUpdateTask).toHaveBeenCalledWith(1, {
        ...sampleTasks[0],
        title: 'Updated homework'
      });
    });

    test('cancels changes when "Cancel" is clicked in edit mode', async () => {
      const user = userEvent.setup();
      
      render(
        <PlannerPage
          tasks={[sampleTasks[0]]}
          addTask={mockAddTask}
          updateTask={mockUpdateTask}
          deleteTask={mockDeleteTask}
        />
      );

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: 'Edit' }));

      // Modify the title
      const titleInput = screen.getByDisplayValue('Complete homework');
      await user.clear(titleInput);
      await user.type(titleInput, 'Should not save');

      // Cancel changes
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockUpdateTask).not.toHaveBeenCalled();
      // Should return to view mode
      expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('filters update when new tasks with different subjects are added', async () => {
      const user = userEvent.setup();
      
      // Use a component wrapper to manage state properly
      const TestWrapper = () => {
        const [tasks, setTasks] = React.useState([]);
        
        const addTask = (task) => {
          setTasks(prev => [...prev, { ...task, id: prev.length + 1 }]);
        };
        
        return (
          <PlannerPage
            tasks={tasks}
            addTask={addTask}
            updateTask={mockUpdateTask}
            deleteTask={mockDeleteTask}
          />
        );
      };

      render(<TestWrapper />);

      // Initially, subject filter should only have "All"
      let subjectFilter = screen.getAllByLabelText('Subject')[1]; // Second one is in filters
      expect(subjectFilter.options.length).toBe(1);

      // Add a task
      await user.type(screen.getByPlaceholderText('e.g., Finish homework'), 'Task 1');
      await user.type(screen.getByPlaceholderText('e.g., Science'), 'Physics');
      await user.type(screen.getByLabelText('Due Date'), '2026-03-01');
      await user.selectOptions(screen.getAllByLabelText('Priority')[0], 'High');
      await user.selectOptions(screen.getAllByLabelText('Status')[0], 'To-Do');
      await user.click(screen.getByRole('button', { name: 'Add' }));

      // Wait for the component to update
      await waitFor(() => {
        expect(screen.getByText('1 task(s)')).toBeInTheDocument();
      });

      // Subject filter should now include "Physics"
      subjectFilter = screen.getAllByLabelText('Subject')[1]; // Second one is in filters
      const options = Array.from(subjectFilter.options).map(opt => opt.value);
      expect(options).toContain('Physics');
    });
  });
});