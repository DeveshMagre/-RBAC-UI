import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const addUser = async (user) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

export const updateUser = async (id, updatedUser) => {
  const response = await axios.put(`${API_URL}/users/${id}`, updatedUser);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/users/${id}`);
};

export const fetchRoles = async () => {
  const response = await axios.get(`${API_URL}/roles`);
  return response.data;
};

export const addRole = async (role) => {
  const response = await axios.post(`${API_URL}/roles`, role);
  return response.data;
};

export const deleteRole = async (id) => {
await axios.delete(`${API_URL}/roles/${id}`);
  };

export const updateRole = async (id, updatedRole) => {
  const response = await axios.put(`${API_URL}/roles/${id}`, updatedRole);
  return response.data;
};
