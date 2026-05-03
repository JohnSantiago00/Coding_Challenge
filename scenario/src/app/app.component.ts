import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TaskService } from './tasks/task.service';
import { Observable } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AuthUser } from './auth/auth-types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected toast$: Observable<string | null>;
  protected currentUser$: Observable<AuthUser | null>;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.toast$ = this.taskService.toast$
    this.currentUser$ = this.authService.currentUser$
    this.authService.loadCurrentUser().subscribe()
  }

  protected clearToast(): void {
    this.taskService.clearToast()
  }

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'])
      },
    })
  }
}
