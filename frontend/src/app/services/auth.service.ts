import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  // private apiUrl = 'http://localhost:8080/api/auth';
  private apiUrl = '/api/auth';

  isLoggedIn = signal<boolean>(this.hasToken());
  currentUser = signal<string>(this.getStoredUser() ?? '');

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  private getStoredUser(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  register(username: string, password: string) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`, { username, password }
    ).pipe(tap(res => this.storeSession(res)));
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`, { username, password }
    ).pipe(tap(res => this.storeSession(res)));
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem('jwt_token', res.token);
    localStorage.setItem('username', res.username);
    this.isLoggedIn.set(true);
    this.currentUser.set(res.username);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    this.isLoggedIn.set(false);
    this.currentUser.set('');
    this.router.navigate(['/login']);
  }
}