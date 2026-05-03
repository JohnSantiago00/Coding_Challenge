import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../../task-types';
import { FormsModule, NgForm } from '@angular/forms';

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

  protected onSubmit(taskForm: NgForm): void {
    if (taskForm.invalid) {
      return
    }

    const taskToCreate: Task = {
      ...this.task,
    }

    const resetTask: Task = {
      name: '',
      due: '',
      description: '',
      complete: false
    };

    this.taskService.createTask(taskToCreate)
    this.task = resetTask
    taskForm.resetForm(resetTask)
  }
}
