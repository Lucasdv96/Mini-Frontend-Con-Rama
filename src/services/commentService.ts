import { api } from './api';
import { Comment } from '../types';

export const commentService = {
  async getByTask(taskId: number, usuarioId: number): Promise<Comment[]> {
    try {
      console.log('📝 Obteniendo comentarios para tarea:', taskId, 'usuario:', usuarioId);
      
      // Los GET no pueden tener body, así que usamos params o query parameters
      const response = await api.get(`/tareas/${taskId}/comentarios`, {
        params: { usuarioId } // Esto lo convierte en query parameters: ?usuarioId=123
      });
      
      console.log('📝 Comentarios recibidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en getByTask:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      throw error;
    }
  },

  async create(taskId: number, contenido: string, usuarioId: number): Promise<Comment> {
    try {
      console.log('📝 Creando comentario:', { taskId, contenido, usuarioId });
      
      const response = await api.post(`/tareas/${taskId}/comentarios`, {
        contenido,
        usuarioId
      });
      
      console.log('📝 Comentario creado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en create comment:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      throw error;
    }
  },

  async update(commentId: number, contenido: string, usuarioId: number): Promise<Comment> {
    try {
      const response = await api.put(`/comentarios/${commentId}`, {
        contenido,
        usuarioId
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en update comment:', error);
      throw error;
    }
  },

  async delete(commentId: number, usuarioId: number): Promise<void> {
    try {
      await api.delete(`/comentarios/${commentId}`, {
        data: { usuarioId }
      });
    } catch (error: any) {
      console.error('❌ Error en delete comment:', error);
      throw error;
    }
  }
};