import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthResponse, AuthUser, LoginRequest, SignupRequest } from './auth-types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiUrl = 'http://localhost:5200/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private authErrorSubject = new BehaviorSubject<string | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  authError$ = this.authErrorSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value
  }

  loadCurrentUser(): Observable<AuthUser | null> {
    return this.http
      .get<AuthResponse>(`${this.authApiUrl}/me`, { withCredentials: true })
      .pipe(
        map((response) => response.user),
        tap((user) => {
          this.currentUserSubject.next(user)
        }),
        catchError(() => {
          this.currentUserSubject.next(null)
          return of(null)
        }),
      )
  }

  signup(email: string, password: string): Observable<AuthUser> {
    this.clearError()

    const payload: SignupRequest = { email, password }

    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/signup`, payload, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.user),
        tap((user) => {
          this.currentUserSubject.next(user)
        }),
        catchError((error) => {
          this.authErrorSubject.next(
            error?.error?.error || 'Unable to create account.',
          )
          return throwError(() => error)
        }),
      )
  }

  login(email: string, password: string): Observable<AuthUser> {
    this.clearError()

    const payload: LoginRequest = { email, password }

    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/login`, payload, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.user),
        tap((user) => {
          this.currentUserSubject.next(user)
        }),
        catchError((error) => {
          this.authErrorSubject.next(
            error?.error?.error || 'Unable to log in.',
          )
          return throwError(() => error)
        }),
      )
  }

  logout(): Observable<void> {
    this.clearError()

    return this.http
      .post<void>(`${this.authApiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null)
        }),
      )
  }

  clearError(): void {
    this.authErrorSubject.next(null)
  }
}
