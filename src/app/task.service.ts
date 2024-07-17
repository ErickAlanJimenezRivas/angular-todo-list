import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Lista de tareas inicial, simulando datos para propósitos de demostración
  private tasks: Task[] = [
    { id: 1, title: 'Ejemplo 1', priority: 'Alta', tags: ['Tag1', 'Tag2'], startDate: new Date(), endDate: null, completed: false },
    { id: 2, title: 'Ejemplo 2', priority: 'Media', tags: ['Tag1', 'Tag2'], startDate: new Date(), endDate: new Date(), completed: true }
  ];

  // Subject para emitir cambios en la lista de tareas
  private tasksSubject = new Subject<Task[]>();

  constructor() {}

  /**
   * Obtiene todas las tareas como un Observable.
   * @returns Observable que emite un arreglo de tareas.
   */
  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  /**
   * Obtiene un Observable del Subject `tasksSubject`, que emite cambios en la lista de tareas.
   * @returns Observable que emite un arreglo de tareas.
   */
  getTasksSubject(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  /**
   * Agrega una nueva tarea a la lista de tareas.
   * @param newTask La nueva tarea que se va a agregar.
   */
  addTask(newTask: Task): void {
    newTask.id = this.tasks.length + 1;
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]); // Emitir una nueva lista de tareas a los suscriptores
  }

  /**
   * Actualiza una tarea existente en la lista de tareas.
   * @param updatedTask La tarea actualizada que reemplazará a la existente.
   */
  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask };
      this.tasksSubject.next([...this.tasks]); // Emitir una nueva lista de tareas a los suscriptores
    }
  }

  /**
   * Elimina una tarea de la lista de tareas.
   * @param taskId El ID de la tarea que se va a eliminar.
   */
  deleteTask(taskId: number): void {
    const index = this.tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.tasksSubject.next([...this.tasks]); // Emitir una nueva lista de tareas a los suscriptores
    }
  }
}
