import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../../task-types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-update',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent {
  protected taskId: string = ''
  protected task: Task = {
    name: '',
    due: '',
    description: '',
    complete: false
  };

  constructor(private taskService: TaskService) {}

  protected onSubmit(): void {
    this.taskService.updateTask(this.taskId, this.task)
    this.taskId = ''
    this.task = {
      name: '',
      due: '',
      description: '',
      complete: false
    };
  }
}
