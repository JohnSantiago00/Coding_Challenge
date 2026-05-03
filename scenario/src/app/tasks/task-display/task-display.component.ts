import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { Task, TaskAndId } from '../../task-types';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './task-display.component.html',
})
export class TaskDisplayComponent {
  protected tasks$: Observable<Array<TaskAndId>>;
  protected error$: Observable<string | null>;
  protected editingTaskId: string | null = null;
  protected taskPendingDelete: TaskAndId | null = null;
  protected searchTerm: string = '';
  protected statusFilter: 'all' | 'complete' | 'incomplete' = 'all';
  protected sortBy: 'newest' | 'oldest' | 'dueSoonest' | 'dueLatest' | 'completeFirst' | 'incompleteFirst' = 'newest';
  protected editedTask: Task = {
    name: '',
    due: '',
    description: '',
    complete: false,
  };


  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks()
    this.error$ = this.taskService.error$
  }

  protected startEdit(task: TaskAndId): void {
    this.editingTaskId = task._id
    this.editedTask = {
      name: task.name,
      due: this.toDateInputValue(task.due),
      description: task.description,
      complete: task.complete,
    }
  }

  protected cancelEdit(): void {
    this.editingTaskId = null
    this.editedTask = {
      name: '',
      due: '',
      description: '',
      complete: false,
    }
  }

  protected saveEdit(id: string, editTaskForm: NgForm): void {
    const trimmedName = this.editedTask.name.trim()
    const trimmedDescription = this.editedTask.description.trim()

    if (
      editTaskForm.invalid ||
      trimmedName.length === 0 ||
      !this.editedTask.due ||
      trimmedDescription.length === 0
    ) {
      return
    }

    this.taskService.updateTask(id, {
      ...this.editedTask,
      name: trimmedName,
      description: trimmedDescription,
    })
    this.cancelEdit()
  }

  protected toggleComplete(task: TaskAndId): void {
    this.taskService.updateTask(task._id, {
      name: task.name,
      due: this.toDateInputValue(task.due),
      description: task.description,
      complete: !task.complete,
    })
  }

  protected openDeleteModal(task: TaskAndId): void {
    this.taskPendingDelete = task
  }

  protected closeDeleteModal(): void {
    this.taskPendingDelete = null
  }

  protected confirmDelete(): void {
    if (!this.taskPendingDelete) return

    const taskId = this.taskPendingDelete._id

    this.taskService.deleteTask(taskId)

    if (this.editingTaskId === taskId) {
      this.cancelEdit()
    }

    this.closeDeleteModal()
  }

  protected toDateInputValue(due: string | Date): string {
    if (typeof due === 'string') {
      const normalizedDue = due.trim()

      if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDue)) {
        return normalizedDue
      }

      if (/^\d{4}-\d{2}-\d{2}T/.test(normalizedDue)) {
        return normalizedDue.slice(0, 10)
      }
    }

    const localDate = due instanceof Date ? due : new Date(due)

    if (Number.isNaN(localDate.getTime())) {
      return ''
    }

    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  protected formatDueDate(due: string | Date): string {
    const normalizedDue = this.toDateInputValue(due)

    if (!normalizedDue) {
      return ''
    }

    const [year, month, day] = normalizedDue.split('-').map(Number)
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    return `${monthNames[month - 1]} ${day}, ${year}`
  }

  protected getFilteredTasks(tasks: Array<TaskAndId>): Array<TaskAndId> {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase()

    const filteredTasks = tasks.filter((task) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        task.name.toLowerCase().includes(normalizedSearchTerm) ||
        task.description.toLowerCase().includes(normalizedSearchTerm)

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'complete' && task.complete) ||
        (this.statusFilter === 'incomplete' && !task.complete)

      return matchesSearch && matchesStatus
    })

    const sortedTasks = [...filteredTasks]

    sortedTasks.sort((a, b) => {
      switch (this.sortBy) {
        case 'oldest':
          return a._id.localeCompare(b._id)
        case 'dueSoonest':
          return this.getDueTime(a.due) - this.getDueTime(b.due)
        case 'dueLatest':
          return this.getDueTime(b.due) - this.getDueTime(a.due)
        case 'completeFirst':
          return Number(b.complete) - Number(a.complete)
        case 'incompleteFirst':
          return Number(a.complete) - Number(b.complete)
        case 'newest':
        default:
          return b._id.localeCompare(a._id)
      }
    })

    return sortedTasks
  }

  private getDueTime(due: string | Date): number {
    const normalizedDue = this.toDateInputValue(due)

    if (!normalizedDue) {
      return 0
    }

    const [year, month, day] = normalizedDue.split('-').map(Number)

    return new Date(year, month - 1, day).getTime()
  }
}
