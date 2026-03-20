import { Routes } from '@angular/router';
import { TaskList } from './tasks/task-list/task-list';
import { TaskForm } from './tasks/task-form/task-form';
import { Login } from './auth/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', component: TaskList, canActivate: [authGuard] },
    { path: 'tasks/new', component: TaskForm, canActivate: [authGuard] },
    { path: 'tasks/edit/:id', component: TaskForm, canActivate: [authGuard] },
];
