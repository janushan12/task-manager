import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
    transform(value: string): string {
        const labels: Record<string, string> = {
            ALL: 'All',
            TO_DO: 'To Do',
            IN_PROGRESS: 'In Progress',
            DONE: 'Done',
        };
        return labels[value] ?? value;
    }
}