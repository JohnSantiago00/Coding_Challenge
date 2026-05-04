import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Task, TaskAndId } from '../../task-types';

@Component({
  selector: 'app-task-edit-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-edit-form.component.html',
})
export class TaskEditFormComponent {
  protected editedTask: Task = {
    name: '',
    due: '',
    description: '',
    complete: false,
  };

  @Input({ required: true })
  set task(task: TaskAndId) {
    this._task = task
    this.editedTask = {
      name: task.name,
      due: this.toDateInputValue(task.due),
      description: task.description,
      complete: task.complete,
    }
  }

  get task(): TaskAndId {
    return this._task
  }

  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  private _task!: TaskAndId;

  protected submitEdit(editTaskForm: NgForm): void {
    const trimmedName = this.editedTask.name.trim()
    const trimmedDescription = this.editedTask.description.trim()

    if (
      editTaskForm.invalid ||
      trimmedName.length === 0 ||
      !this.editedTask.due ||
      trimmedDescription.length === 0
    ) {
      return
    }

    this.save.emit({
      ...this.editedTask,
      name: trimmedName,
      description: trimmedDescription,
    })
  }

  protected toDateInputValue(due: string): string {
    const normalizedDue = due.trim()

    if (!normalizedDue) {
      return ''
    }

    return normalizedDue.slice(0, 10)
  }
}
