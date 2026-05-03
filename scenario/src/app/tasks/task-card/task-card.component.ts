import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskAndId } from '../../task-types';

@Component({
  selector: 'app-task-card',
  standalone: true,
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: TaskAndId;
  @Input({ required: true }) formattedDueDate!: string;

  @Output() toggleComplete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
