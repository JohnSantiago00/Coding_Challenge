// No need to change this file
import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../../task-types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-create.component.html',
})
export class TaskCreateComponent {
  protected task: Task = {
    name: '',
    due: '',
    description: '',
    complete: false
  };

  constructor(private taskService: TaskService) { }

  protected onSubmit(): void {
    this.taskService.createTask(this.task)
    this.task = {
      name: '',
      due: '',
      description: '',
      complete: false
    };
  }
}
