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
  // 🔹 MAIN DATA
  tasks: Tasks[] = [];

  // 🔹 UI STATE
  selectedTab: 'all' | 'pending' | 'completed' = 'all';
  searchText: string = '';

  showAdd = false;
  newTaskTitle = '';
  isCreating = false;

  editingTaskId: string | null = null;
  editText: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  // =====================================================
  // 🔹 GET TASKS (API)
  // =====================================================
  fetchTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Error fetching tasks:', err),
    });
  }

  // =====================================================
  // 🔹 CREATE TASK
  // =====================================================
  createTask() {
    const title = this.newTaskTitle.trim();

    if (!title || this.isCreating) return;

    this.isCreating = true;

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
        },
      });
  }

  // =====================================================
  // 🔹 TOGGLE TASK
  // =====================================================
  toggleTask(task: Tasks) {
    // Optimistic UI update
    const updatedStatus = task.completed;

    this.taskService.toggleTask(task._id!, updatedStatus).subscribe({
      error: (err) => {
        console.error('Error updating task:', err);
        // revert if failed
        task.completed = !updatedStatus;
      },
    });
  }

  // =====================================================
  // 🔹 DELETE TASK
  // =====================================================
  deleteTask(task: Tasks) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    // Optimistic remove
    const backup = this.tasks;
    this.tasks = this.tasks.filter((t) => t._id !== task._id);

    this.taskService.deleteTask(task._id!).subscribe({
      error: (err) => {
        console.error('Error deleting task:', err);
        this.tasks = backup; // revert
      },
    });
  }

  // =====================================================
  // 🔹 EDIT TASK
  // =====================================================
  startEdit(task: Tasks) {
    this.editingTaskId = task._id!;
    this.editText = task.title;
  }

  saveEdit(task: Tasks) {
    if (!this.editText.trim()) return;

    const newTitle = this.editText;

    this.taskService.updateTask(task._id!, { title: newTitle }).subscribe({
      next: () => {
        task.title = newTitle;
        this.editingTaskId = null;
        this.editText = '';
      },
      error: (err) => console.error('Error updating task:', err),
    });
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editText = '';
  }

  // =====================================================
  // 🔹 TAB SWITCHING
  // =====================================================
  setTab(tab: 'all' | 'pending' | 'completed') {
    this.selectedTab = tab;
  }

  // =====================================================
  // 🔹 GETTERS
  // =====================================================
  get pendingTasks() {
    return this.tasks.filter((t) => !t.completed);
  }

  get completedTasks() {
    return this.tasks.filter((t) => t.completed);
  }

  // =====================================================
  // 🔹 FILTER LOGIC
  // =====================================================
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
