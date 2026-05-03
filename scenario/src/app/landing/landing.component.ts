import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/auth-types';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  protected currentUser$: Observable<AuthUser | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$
  }
}
