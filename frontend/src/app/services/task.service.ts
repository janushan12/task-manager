import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus } from '../models/task';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tasks';

  private _tasks = signal<Task[]>([]);

  readonly tasks = this._tasks.asReadonly();

  readonly totalCount = computed(() => this.tasks().length);
  readonly todoCount = computed(() => this.tasks().filter(t => t.status === 'TO_DO').length);
  readonly inProgressCount = computed(() => this.tasks().filter(t => t.status === 'IN_PROGRESS').length);
  readonly doneCount = computed(() => this.tasks().filter(t => t.status === 'DONE').length);

  loadAll(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: tasks => this._tasks.set(tasks),
      error: err => console.error('Failed to load tasks', err)
    });
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(newTask => {
        this._tasks.update(tasks => [...tasks, newTask]);
      })
    );
  }

  update(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(updated => {
        this._tasks.update(tasks =>
          tasks.map(t => t.id === id ? updated : t)
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(t => t.id !== id));
      })
    );
  }

}
