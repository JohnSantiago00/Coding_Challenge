import { Component } from '@angular/core';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskDisplayComponent } from './task-display/task-display.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskCreateComponent, TaskDisplayComponent],
  templateUrl: './tasks.component.html',
})
export class TasksComponent {

}
