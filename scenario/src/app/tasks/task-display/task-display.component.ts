import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { Task, TaskAndId } from '../../task-types';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './task-display.component.html',
})
export class TaskDisplayComponent {
  protected tasks$: Observable<Array<TaskAndId>>;
  protected editingTaskId: string | null = null;
  protected editedTask: Task = {
    name: '',
    due: new Date(),
    description: '',
    complete: false,
  };


  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks()
  }

  protected startEdit(task: TaskAndId): void {
    this.editingTaskId = task._id
    this.editedTask = {
      name: task.name,
      due: task.due,
      description: task.description,
      complete: task.complete,
    }
  }

  protected cancelEdit(): void {
    this.editingTaskId = null
    this.editedTask = {
      name: '',
      due: new Date(),
      description: '',
      complete: false,
    }
  }

  protected saveEdit(id: string): void {
    this.taskService.updateTask(id, this.editedTask)
    this.cancelEdit()
  }

  protected toggleComplete(task: TaskAndId): void {
    this.taskService.updateTask(task._id, {
      name: task.name,
      due: task.due,
      description: task.description,
      complete: !task.complete,
    })
  }

  protected deleteTask(task: TaskAndId): void {
    const confirmed = window.confirm(`Delete "${task.name}"?`)

    if (!confirmed) return

    this.taskService.deleteTask(task._id)

    if (this.editingTaskId === task._id) {
      this.cancelEdit()
    }
  }
}
