import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)],)
  });

  get usernameCtrl() {
    return this.form.controls.username;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  toggleMode(): void {
    this.mode.update(m => m === 'login' ? 'register' : 'login');
    this.error.set(null);
    this.form.reset();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading.set(true);
    const { username, password } = this.form.getRawValue();
    const request$ = this.mode() === 'login' ? this.authService.login(username, password) : this.authService.register(username, password);
    request$.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => {
        this.error.set(err.status === 401 ? 'Invalid username or password' : 'Something went wrong');
        this.loading.set(false);
      },
    });
  }
}