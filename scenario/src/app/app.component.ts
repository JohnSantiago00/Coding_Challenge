import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TaskService } from './tasks/task.service';
import { Observable } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet],
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
