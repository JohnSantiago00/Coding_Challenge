import { Component } from '@angular/core';
import { TasksComponent } from './tasks/tasks.component';
import { HttpClientModule } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { TaskService } from './tasks/task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, HttpClientModule, TasksComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected toast$: Observable<string | null>;

  constructor(private taskService: TaskService) {
    this.toast$ = this.taskService.toast$
  }

  protected clearToast(): void {
    this.taskService.clearToast()
  }
}
