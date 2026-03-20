import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task';

@Pipe({ name: 'taskCount', standalone: true })
export class TaskCountPipe implements PipeTransform {
    transform(tasks: Task[], status: string): number {
        return tasks.filter(t => t.status === status).length;
    }
}