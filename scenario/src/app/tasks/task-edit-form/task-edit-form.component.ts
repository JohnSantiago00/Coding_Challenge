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

  protected toDateInputValue(due: string | Date): string {
    if (typeof due === 'string') {
      const normalizedDue = due.trim()

      if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDue)) {
        return normalizedDue
      }

      if (/^\d{4}-\d{2}-\d{2}T/.test(normalizedDue)) {
        return normalizedDue.slice(0, 10)
      }
    }

    const localDate = due instanceof Date ? due : new Date(due)

    if (Number.isNaN(localDate.getTime())) {
      return ''
    }

    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
}
