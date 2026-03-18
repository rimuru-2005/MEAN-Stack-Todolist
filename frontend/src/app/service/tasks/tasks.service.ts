import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Tasks } from '../../models/tasks.model';
import { environment } from '../../../environments/environment';

interface TasksListResponse {
  success: boolean;
  tasks: Tasks[];
}

interface TaskResponse {
  success: boolean;
  task: Tasks;
}

interface EditTaskResponse {
  success: boolean;
  editedTask: Tasks;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Tasks[]> {
    return this.http
      .get<TasksListResponse>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(map((response) => response.tasks));
  }

  createTask(task: { title: string }): Observable<Tasks> {
    return this.http
      .post<TaskResponse>(this.apiUrl, task, {
        withCredentials: true,
      })
      .pipe(map((response) => response.task));
  }

  updateTask(id: string, data: { title: string }): Observable<Tasks> {
    return this.http
      .patch<EditTaskResponse>(`${this.apiUrl}/edit/${id}`, data, {
        withCredentials: true,
      })
      .pipe(map((response) => response.editedTask));
  }

  toggleTask(id: string, completed: boolean): Observable<Tasks> {
    return this.http
      .patch<TaskResponse>(
        `${this.apiUrl}/${id}`,
        { completed },
        {
          withCredentials: true,
        },
      )
      .pipe(map((response) => response.task));
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
