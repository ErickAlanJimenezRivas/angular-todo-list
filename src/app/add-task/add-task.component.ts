import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  taskTitle: string = '';
  taskPriority: string = '';
  taskTags: string = '';

  constructor(private taskService: TaskService) {}

  /**
   * Maneja la lógica para agregar una nueva tarea.
   * @param form El formulario NgForm que contiene los datos de la tarea.
   */
  onAddTask(form: NgForm): void {
    // Verifica si el formulario es inválido (campos vacíos)
    if (form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Todos los campos deben estar llenos para agregar una tarea.'
      });
      return;
    }

    // Crea un nuevo objeto de tipo Task con los datos del formulario
    const newTask: Task = {
      id: Date.now(), // Genera un ID único basado en la marca de tiempo actual
      title: this.taskTitle,
      priority: this.taskPriority,
      tags: this.taskTags.split(',').map(tag => tag.trim()), // Divide las etiquetas por coma y las limpia
      startDate: new Date(), // Establece la fecha de inicio como la fecha actual
      endDate: null, // Inicialmente no hay fecha de finalización
      completed: false // Inicialmente la tarea no está completada
    };

    // Llama al servicio para agregar la nueva tarea
    this.taskService.addTask(newTask);

    // Reinicia los campos del formulario y las variables de la clase
    this.taskTitle = '';
    this.taskPriority = '';
    this.taskTags = '';
    form.resetForm(); // Limpia el formulario

    // Muestra una alerta de éxito utilizando SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Tarea agregada',
      text: 'La tarea se ha agregado exitosamente.'
    });
  }
}
