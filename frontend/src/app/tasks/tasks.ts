import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tasks } from '../models/tasks.model';

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

  editingTaskId: string | null = null;
  editText: string = '';

  ngOnInit(): void {
    this.loadLocalTasks();
  }

  // =====================================================
  // 🔹 TEMP LOCAL DATA (REPLACE WITH SERVICE LATER)
  // =====================================================
  loadLocalTasks() {
    this.tasks = [
      {
        _id: '1',
        title: 'Learn Angular',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        title: 'Build Todo App',
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '3',
        title: 'Workout',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '3',
        title: 'Workout',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '3',
        title: 'Workout',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '3',
        title: 'Workout',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '3',
        title: 'Workout',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '3',
        title: 'Workout',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    /*
    🔥 FUTURE (Service Call):
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
    */
  }

  // =====================================================
  // 🔹 CREATE TASK
  // =====================================================
  createTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Tasks = {
      _id: Date.now().toString(), // temp ID
      title: this.newTaskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    this.newTaskTitle = '';
    this.showAdd = false;

    /*
    🔥 FUTURE:
    this.taskService.createTask({ title: this.newTaskTitle })
      .subscribe(task => this.tasks.unshift(task));
    */
  }

  // =====================================================
  // 🔹 TOGGLE TASK
  // =====================================================
  toggleTask(task: Tasks) {
    /*
  value already updated by ngModel
  */
    /*
  🔥 FUTURE API:
  this.taskService.updateTask(task._id, { completed: task.completed }).subscribe();
  */
  }

  // =====================================================
  // 🔹 DELETE TASK
  // =====================================================
  deleteTask(task: Tasks) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.tasks = this.tasks.filter((t) => t._id !== task._id);

    /*
    🔥 FUTURE:
    this.taskService.deleteTask(task._id)
      .subscribe();
    */
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

    task.title = this.editText;
    this.editingTaskId = null;
    this.editText = '';

    /*
  🔥 FUTURE:
  this.taskService.updateTask(task._id, { title: this.editText }).subscribe();
  */
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
  // 🔹 GETTERS (for counts)
  // =====================================================
  get pendingTasks() {
    return this.tasks.filter((t) => !t.completed);
  }

  get completedTasks() {
    return this.tasks.filter((t) => t.completed);
  }

  // =====================================================
  // 🔹 FILTER LOGIC (TAB + SEARCH)
  // =====================================================
  filteredTasks(): Tasks[] {
    let filtered = this.tasks;

    // 🔹 Tab filtering
    if (this.selectedTab === 'pending') {
      filtered = filtered.filter((t) => !t.completed);
    } else if (this.selectedTab === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    // 🔹 Search filtering
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(search));
    }

    return filtered;
  }
}
