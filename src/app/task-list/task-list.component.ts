import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  completedTasks: Task[] = [];
  editingTask: Task | undefined;

  constructor(private taskService: TaskService) {}

  /**
   * Inicializa las listas de tareas pendientes y completadas al inicio del componente.
   * Suscribe a cambios en las tareas para mantener actualizadas las listas.
   */
  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.filter(task => !task.completed);
      this.completedTasks = tasks.filter(task => task.completed);
    });

    this.taskService.getTasksSubject().subscribe(tasks => {
      this.tasks = tasks.filter(task => !task.completed);
      this.completedTasks = tasks.filter(task => task.completed);
    });
  }

  /**
   * Inicia la edición de una tarea específica.
   * @param task La tarea que se va a editar.
   */
  onEdit(task: Task): void {
    this.editingTask = { ...task };
  }

  /**
   * Actualiza una tarea después de editarla.
   * @param updatedTask La tarea actualizada.
   */
  onUpdateTask(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask);
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask };
    }
    this.editingTask = undefined;
  }

  /**
   * Cancela la edición de la tarea actualmente en proceso de edición.
   */
  onCancelEdit(): void {
    this.editingTask = undefined;
  }

  /**
   * Elimina una tarea específica.
   * @param taskId El ID de la tarea que se va a eliminar.
   */
  onDelete(taskId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, bórralo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(taskId);
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.completedTasks = this.completedTasks.filter(task => task.id !== taskId);
        Swal.fire(
          '¡Borrado!',
          'El pendiente ha sido borrado.',
          'success'
        );
      }
    });
  }

  /**
   * Marca una tarea como completada.
   * @param task La tarea que se va a marcar como completada.
   */
  onCompleteTask(task: Task): void {
    task.endDate = new Date();
    task.completed = true;
    this.taskService.updateTask(task);

    // Elimina la tarea de las tareas pendientes
    this.tasks = this.tasks.filter(t => t.id !== task.id);

    // Agrega la tarea completada a la lista de completadas (si no está ya presente)
    if (!this.completedTasks.find(t => t.id === task.id)) {
      this.completedTasks.push(task);
    }
  }

  /**
   * Cierra el modal de edición de tarea.
   */
  closeModal(): void {
    const modalElement = document.getElementById('editTaskModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      const backdropElement = document.getElementsByClassName('modal-backdrop')[0];
      if (backdropElement) {
        backdropElement.remove();
      }
      document.body.classList.remove('modal-open');
    }
  }
}
