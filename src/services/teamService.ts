import { api } from './api';
import { Team } from '../types';

export const teamService = {
  async getAll(): Promise<Team[]> {
    const response = await api.get('/teams');
    return response.data;
  },

  async getById(id: number): Promise<Team> {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  async create(name: string, propietarioId: number): Promise<Team> {
    const response = await api.post('/teams', { name, propietarioId });
    return response.data;
  },

  async update(id: number, name: string, actorUserId: number): Promise<Team> {
    const response = await api.put(`/teams/${id}`, { name, actorUserId });
    return response.data;
  },

  async delete(id: number, actorUserId: number): Promise<void> {
    await api.delete(`/teams/${id}`, { data: { actorUserId } });
  },

  async addUser(teamId: number, userId: number, actorUserId: number): Promise<any> {
    const response = await api.post(`/teams/${teamId}/users/${userId}`, { actorUserId });
    return response.data;
  },

  async listMembers(teamId: number): Promise<any[]> {
    const response = await api.get(`/teams/${teamId}/miembros`);
    return response.data;
  }
};