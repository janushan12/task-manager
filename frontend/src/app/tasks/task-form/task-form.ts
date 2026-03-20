import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task, TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-form',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isEdit = signal(false);
  loading = signal(false);
  taskId = signal<number | null>(null);

  statuses: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE'];

  form = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.maxLength(80)]),
    description: this.fb.control('', [Validators.maxLength(300)]),
    status: this.fb.control<TaskStatus>('TO_DO', Validators.required),
  });

  statusLabel(s: string): string {
    return { TO_DO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }[s] ?? s;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit.set(true);
      this.taskId.set(Number(idParam));
      this.loadTask(Number(idParam));
    }
  }

  private loadTask(id: number): void {
    this.loading.set(true);
    this.taskService.getById(id).subscribe({
      next: task => {
        this.form.patchValue(task);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Task not found', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      },
    });
  }

  get titleCtrl() { return this.form.controls.title; }
  get descCtrl() { return this.form.controls.description; }

  get titleError(): string | null {
    if (this.titleCtrl.errors?.['required']) return 'Title is required';
    if (this.titleCtrl.errors?.['maxlength']) return 'Max 80 characters allowed';
    return null;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    const payload = this.form.getRawValue() as Task;
    const id = this.taskId();

    const request$ = (this.isEdit() && id) ? this.taskService.update(id, payload) : this.taskService.create(payload);

    request$.subscribe({
      next: () => {
        const msg = this.isEdit() ? 'Task updated!' : 'Task created!';
        this.snackBar.open(msg, 'OK', { duration: 2500 });
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.snackBar.open('Error saving task', 'Close', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }
}