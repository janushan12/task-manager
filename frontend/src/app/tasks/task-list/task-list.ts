import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterModule } from '@angular/router';
import { Task, TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  imports: [
    RouterLink,
    DatePipe,
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  
  currentUser = computed(() => this.authService.currentUser());

  activeFilter = signal<string>('ALL');
  filters: string[] = ['ALL', 'TO_DO', 'IN_PROGRESS', 'DONE'];
  displayedColumns = ['title', 'description', 'status', 'createdAt', 'actions'];

  filteredTasks = computed(() => {
    const filter = this.activeFilter();
    const tasks = this.taskService.tasks();
    return filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);
  });

  totalCount = this.taskService.totalCount;
  todoCount = this.taskService.todoCount;
  inProgressCount = this.taskService.inProgressCount;
  doneCount = this.taskService.doneCount;

  ngOnInit(): void {
    this.taskService.loadAll();
  }

  setFilter(f: string): void {
    this.activeFilter.set(f);
  }

  filterLabel(f: string): string {
    const map: Record<string, string> = {
      ALL: 'All', TO_DO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done',
    };
    return map[f] ?? f;
  }

  statusLabel(s: string): string {
    return this.filterLabel(s);
  }

  deleteTask(id: number): void {
    if (!confirm('Delete this task?')) return;
    this.taskService.delete(id).subscribe({
      next: () => this.snackBar.open('Task Deleted', 'OK', { duration: 2500 }),
      error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 }),
    });
  }

  statusClass(status: TaskStatus): string {
    return { TO_DO: 'chip-todo', IN_PROGRESS: 'chip-progress', DONE: 'chip-done' }
    [status] ?? '';
  }

  logout(): void {
    this.authService.logout();
  }
}
