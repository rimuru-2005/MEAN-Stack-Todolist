import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Tasks } from '../../models/tasks.model';
import { TaskService } from '../../service/tasks/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent implements OnInit {
  tasks: Tasks[] = [];

  selectedTab: 'all' | 'pending' | 'completed' = 'all';
  searchText = '';

  showAdd = false;
  newTaskTitle = '';
  isCreating = false;
  isLoading = true;
  taskError: string | null = null;

  editingTaskId: string | null = null;
  editText = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks() {
    this.isLoading = true;
    this.taskError = null;

    this.taskService
      .getTasks()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          this.tasks = data;
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
          this.taskError = 'Unable to load tasks.';
        },
      });
  }

  createTask() {
    const title = this.newTaskTitle.trim();

    if (!title || this.isCreating) return;

    this.isCreating = true;
    this.taskError = null;

    this.taskService
      .createTask({ title })
      .pipe(
        finalize(() => {
          this.isCreating = false;
        }),
      )
      .subscribe({
        next: (task) => {
          this.tasks = [task, ...this.tasks];
          this.newTaskTitle = '';
          this.showAdd = false;
        },
        error: (err) => {
          console.error('Error creating task:', err);
          this.taskError = 'Unable to create task.';
        },
      });
  }

  toggleTask(task: Tasks) {
    const updatedStatus = task.completed;
    this.taskError = null;

    this.taskService.toggleTask(task._id!, updatedStatus).subscribe({
      next: (updatedTask) => {
        task.completed = updatedTask.completed;
      },
      error: (err) => {
        console.error('Error updating task:', err);
        task.completed = !updatedStatus;
        this.taskError = 'Unable to update task.';
      },
    });
  }

  deleteTask(task: Tasks) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    const backup = this.tasks;
    this.tasks = this.tasks.filter((t) => t._id !== task._id);
    this.taskError = null;

    this.taskService.deleteTask(task._id!).subscribe({
      error: (err) => {
        console.error('Error deleting task:', err);
        this.tasks = backup;
        this.taskError = 'Unable to delete task.';
      },
    });
  }

  startEdit(task: Tasks) {
    this.editingTaskId = task._id!;
    this.editText = task.title;
  }

  saveEdit(task: Tasks) {
    const newTitle = this.editText.trim();

    if (!newTitle) return;

    this.taskError = null;

    this.taskService.updateTask(task._id!, { title: newTitle }).subscribe({
      next: (updatedTask) => {
        task.title = updatedTask.title;
        this.editingTaskId = null;
        this.editText = '';
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.taskError = 'Unable to edit task.';
      },
    });
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editText = '';
  }

  setTab(tab: 'all' | 'pending' | 'completed') {
    this.selectedTab = tab;
  }

  get pendingTasks() {
    return this.tasks.filter((t) => !t.completed);
  }

  get completedTasks() {
    return this.tasks.filter((t) => t.completed);
  }

  filteredTasks(): Tasks[] {
    let filtered = this.tasks;

    if (this.selectedTab === 'pending') {
      filtered = filtered.filter((t) => !t.completed);
    } else if (this.selectedTab === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(search));
    }

    return filtered;
  }
}
