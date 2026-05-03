import { Injectable } from '@angular/core';
import { Task, TaskAndId } from '../task-types';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5200/api/tasks'
  private tasksSubject = new BehaviorSubject<Array<TaskAndId>>([]);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private toastSubject = new BehaviorSubject<string | null>(null);
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;
  tasks$ = this.tasksSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  toast$ = this.toastSubject.asObservable();

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Array<TaskAndId>> {
    this.refreshTasks()
    return this.tasks$
  }

  refreshTasks() {
    this.fetchTasks()
  }

  showToast(message: string): void {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId)
      this.toastTimeoutId = null
    }

    this.toastSubject.next(null)
    this.toastSubject.next(message)
    this.toastTimeoutId = setTimeout(() => {
      this.clearToast()
    }, 2500)
  }

  clearToast(clearTimer: boolean = true): void {
    this.toastSubject.next(null)

    if (clearTimer && this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId)
      this.toastTimeoutId = null
    }
  }

  private fetchTasks(clearPreviousError: boolean = true, successMessage?: string): void {
    if (clearPreviousError) {
      this.errorSubject.next(null)
    }

    this.http.get<Array<TaskAndId>>(this.apiUrl).subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks)
        if (successMessage) {
          this.showToast(successMessage)
        }
      },
      error: () => {
        this.errorSubject.next('Something went wrong. Please try again.')
      }
    })
  }

  updateTask(id: string, task: Task): void {
    this.errorSubject.next(null)

    this.http.put(`${this.apiUrl}/${id}`, { task }).subscribe({
      next: () => {
        this.fetchTasks(false, 'Task updated.')
      },
      error: () => {
        this.errorSubject.next('Something went wrong. Please try again.')
      }
    })
  }

  createTask(newTask: Task): void {
    this.errorSubject.next(null)

    this.http.post(this.apiUrl, { task: newTask }).subscribe({
      next: () => {
        this.fetchTasks(false, 'Task created.')
      },
      error: () => {
        this.errorSubject.next('Something went wrong. Please try again.')
      }
    })
  }

  deleteTask(index: string): void {
    this.errorSubject.next(null)

    this.http.delete(`${this.apiUrl}/${index}`).subscribe({
      next: () => {
        this.fetchTasks(false, 'Task deleted.')
      },
      error: () => {
        this.errorSubject.next('Something went wrong. Please try again.')
      }
    })
  }
}
