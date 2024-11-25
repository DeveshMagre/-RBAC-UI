import React, { useState, useEffect } from 'react';
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  fetchRoles,
} from '../services/api';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormHelperText,
} from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' });
  const [roles, setRoles] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', role: '', status: '' });
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    const usersData = await fetchUsers();
    const sortedUsers = usersData.sort((a, b) => a.name.localeCompare(b.name));
    setUsers(sortedUsers);
  
    const rolesData = await fetchRoles();
    setRoles(rolesData);
  };
  

  const validateUser = (user) => {
    const errors = {};
    if (!user.name.trim()) {
      errors.name = 'Name is required.';
    } else if (!/^[A-Za-z\s]+$/.test(user.name)) {
      errors.name = 'Name can only contain letters and spaces.';
    }
    if (!user.email.trim() || !/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Valid email is required.';
    }
    if (!user.role.trim()) {
      errors.role = 'Role is required.';
    }
    if (!['Active', 'Inactive'].includes(user.status)) {
      errors.status = 'Valid status is required.';
    }
    return errors;
  };

  const handleAddUser = async () => {
    const validationErrors = validateUser(newUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const addedUser = await addUser(newUser);
    const updatedUsers = [...users, addedUser].sort((a, b) => a.name.localeCompare(b.name));
    setUsers(updatedUsers);
 
    setNewUser({ name: '', email: '', role: '', status: 'Active' });
    setErrors({});
  };
  

  const handleEditUser = (user) => {
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (editUser) {
      const validationErrors = validateUser(editUser);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      await updateUser(editUser.id, editUser);
      fetchUsersData();
      setIsEditDialogOpen(false);
      setErrors({});
    }
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        User Management
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '400px' }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        <TextField
          label="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          style={{ width: '250px' }}
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          style={{ width: '250px' }}
        />
        <FormControl style={{ width: '250px' }} error={!!errors.role}>
          <InputLabel>Role</InputLabel>
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
          {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
        </FormControl>
        <FormControl style={{ width: '250px' }} error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAddUser} style={{ alignSelf: 'center' }}>
          Add User
        </Button>
      </div>

      {/* User Table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditUser(user)}
                    style={{ width: '120px', marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ width: '120px' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserManagement;
