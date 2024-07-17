import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../task.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnChanges {
  @Input() task!: Task; // Tarea a editar recibida como entrada
  @Output() update = new EventEmitter<Task>(); // Evento emitido al actualizar la tarea
  @Output() cancel = new EventEmitter<void>(); // Evento emitido al cancelar la edición

  editForm: FormGroup; // Formulario reactivo para la edición de la tarea

  constructor(private fb: FormBuilder) {
    // Inicializa el formulario reactivo con validaciones
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      priority: ['', Validators.required],
      tags: ['', Validators.required]
    });
  }

  /**
   * Método del ciclo de vida ngOnChanges que se ejecuta cuando hay cambios en las entradas.
   * Actualiza el formulario con los valores de la tarea recibida.
   */
  ngOnChanges(): void {
    if (this.task) {
      this.editForm.patchValue({
        title: this.task.title,
        priority: this.task.priority,
        tags: this.task.tags.join(', ')
      });
    }
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Actualizar".
   * Emite el evento de actualización si el formulario es válido.
   * Muestra alertas según el resultado de la operación.
   */
  onUpdate(): void {
    if (this.editForm.valid) {
      const updatedTask: Task = {
        ...this.task,
        ...this.editForm.value,
        tags: this.editForm.value.tags.split(',').map((tag: string) => tag.trim())
      };
      this.update.emit(updatedTask); // Emite el evento de actualización con la tarea actualizada
      this.showUpdateSuccessAlert(); // Muestra alerta de actualización exitosa
      this.closeModal(); // Cierra el modal después de emitir el evento de actualización
    } else {
      this.showFieldsRequiredAlert(); // Muestra alerta de campos requeridos si el formulario no es válido
    }
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Cancelar".
   * Emite el evento de cancelación y cierra el modal.
   */
  onCancel(): void {
    this.cancel.emit(); // Emite el evento de cancelación
    this.closeModal(); // Cierra el modal al cancelar la edición
  }

  /**
   * Método para cerrar el modal de edición de tarea.
   * Remueve las clases y elementos de backdrop asociados al modal.
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

  /**
   * Método para mostrar una alerta de éxito al actualizar la tarea.
   */
  showUpdateSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: '¡Tarea actualizada!',
      text: 'La tarea se ha actualizado correctamente.'
    });
  }

  /**
   * Método para mostrar una alerta de campos requeridos si el formulario no es válido.
   */
  showFieldsRequiredAlert(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor, complete todos los campos antes de actualizar la tarea.'
    });
  }
}
