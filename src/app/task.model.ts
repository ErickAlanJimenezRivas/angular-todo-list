/**
 * Interfaz que representa una tarea en la aplicación.
 */
export interface Task {
  id: number;
  title: string;
  priority: string;
  tags: string[];
  startDate: Date;
  endDate: Date | null;
  completed: boolean;
}
