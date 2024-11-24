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

  // Validation error states
  const [errors, setErrors] = useState({ name: '', email: '', role: '', status: '' });

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    const usersData = await fetchUsers();
    setUsers(usersData);

    const rolesData = await fetchRoles();
    setRoles(rolesData);
  };

  // Validation function with alphabet-only check for 'name'
  const validateUser = (user) => {
    const errors = {};
    
    // Validate name to allow only alphabetic characters and spaces
    if (!user.name.trim()) {
      errors.name = 'Name is required.';
    } else if (!/^[A-Za-z\s]+$/.test(user.name)) {
      errors.name = 'Name can only contain letters and spaces.';
    }
    
    // Validate email
    if (!user.email.trim() || !/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Valid email is required.';
    }

    // Validate role
    if (!user.role.trim()) {
      errors.role = 'Role is required.';
    }

    // Validate status
    if (!['Active', 'Inactive'].includes(user.status)) {
      errors.status = 'Valid status is required.';
    }

    return errors;
  };

  // Handle Name Change for 'newUser'
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Allow only alphabetic characters and spaces
    if (/^[A-Za-z\s]*$/.test(value)) {
      setNewUser({ ...newUser, name: value });
    }
  };

  const handleAddUser = async () => {
    const validationErrors = validateUser(newUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const addedUser = await addUser(newUser);
    setUsers([...users, addedUser]);
    setNewUser({ name: '', email: '', role: '', status: 'Active' });
    setErrors({}); // Reset errors
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
      setErrors({}); // Reset errors
    }
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        User Management
      </Typography>
      
      {/* New User Form */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        <TextField
          label="Name"
          value={newUser.name}
          onChange={handleNameChange}  // Allow only alphabetic input
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
            {users.map((user) => (
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
    style={{ width: '120px', marginRight: '10px' , marginBottom:'5px'}}  // Same width and gap for spacing
  >
    Edit
  </Button>
  <Button
    variant="contained"
    color="error"
    onClick={() => handleDeleteUser(user.id)}
    style={{ width: '120px' }}  // Same width as the Edit button
  >
    Delete
  </Button>
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editUser?.name || ''}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only alphabetic characters and spaces
              if (/^[A-Za-z\s]*$/.test(value)) {
                setEditUser({ ...editUser, name: value });
              }
            }}
            fullWidth
            style={{ marginBottom: '10px' }}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            value={editUser?.email || ''}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            fullWidth
            style={{ marginBottom: '10px' }}
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormControl fullWidth style={{ marginBottom: '10px' }} error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              value={editUser?.role || ''}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editUser?.status || ''}
              onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;
