import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskAndId } from '../../task-types';

@Component({
  selector: 'app-task-delete-modal',
  standalone: true,
  templateUrl: './task-delete-modal.component.html',
})
export class TaskDeleteModalComponent {
  @Input({ required: true }) task!: TaskAndId;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();

  protected confirmDelete(): void {
    this.confirm.emit(this.task._id)
  }
}
