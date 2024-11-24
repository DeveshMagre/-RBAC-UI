import React, { useState, useEffect } from 'react';
import { fetchRoles, addRole, updateRole, deleteRole } from '../services/api';
import {
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar
} from '@mui/material';
import { Alert } from '@mui/material'; // To display error messages

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: '' });
  const [openDialog, setOpenDialog] = useState(false); // To control the dialog visibility
  const [currentRole, setCurrentRole] = useState(null); // To store the role being updated
  const [error, setError] = useState(null); // To manage error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false); // To control snackbar visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if form is being submitted
  const [touched, setTouched] = useState(false); // Track if the user has interacted with the form

  useEffect(() => {
    fetchRolesData();
  }, []);

  const fetchRolesData = async () => {
    const rolesData = await fetchRoles();
    setRoles(rolesData);
  };

  const handleAddRole = async () => {
    setTouched(true); // Mark the form as interacted with
    setIsSubmitting(true); // Mark the form as being submitted
    if (!newRole.name.trim() || !newRole.permissions.trim()) {
      setError('Both Role Name and Permissions are required.');
      setSnackbarOpen(true);
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    const permissions = newRole.permissions.split(',').map((permission) => permission.trim());
    if (permissions.some((permission) => !permission)) {
      setError('Permissions must not contain empty values.');
      setSnackbarOpen(true);
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    const addedRole = await addRole({ ...newRole, permissions });
    setRoles([...roles, addedRole]);
    setNewRole({ name: '', permissions: '' });
    setTouched(false); // Reset touched state
    setIsSubmitting(false); // Reset submitting state
  };

  const handleUpdateRole = async () => {
    setTouched(true); // Mark the form as interacted with
    setIsSubmitting(true); // Mark the form as being submitted
    if (!currentRole?.name.trim() || !currentRole?.permissions.trim()) {
      setError('Both Role Name and Permissions are required.');
      setSnackbarOpen(true);
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    const permissions = currentRole.permissions.split(',').map((permission) => permission.trim());
    if (permissions.some((permission) => !permission)) {
      setError('Permissions must not contain empty values.');
      setSnackbarOpen(true);
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    const updatedRole = { ...currentRole, permissions };
    await updateRole(currentRole.id, updatedRole);
    setOpenDialog(false); // Close dialog after updating
    fetchRolesData(); // Refresh roles
    setTouched(false); // Reset touched state
    setIsSubmitting(false); // Reset submitting state
  };

  const handleDeleteRole = async (id) => {
    await deleteRole(id);
    setRoles(roles.filter((role) => role.id !== id));
  };

  const handleOpenDialog = (role) => {
    setCurrentRole({
      ...role,
      permissions: Array.isArray(role.permissions) ? role.permissions.join(', ') : role.permissions
    });
    setOpenDialog(true); // Open the dialog when the button is clicked
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRole(null); // Reset current role when closing
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Role Management</h2>

      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          width: '100%',
        }}
      >
        <TextField
          label="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          error={touched && !newRole.name.trim()} // Show error if the field is touched and empty
          helperText={touched && !newRole.name.trim() ? 'Role Name is required.' : ''}
          style={{ width: '100%', maxWidth: '400px' }}
        />
        <TextField
          label="Permissions (comma-separated)"
          value={newRole.permissions}
          onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value })}
          error={touched && !newRole.permissions.trim()} // Show error if the field is touched and empty
          helperText={touched && !newRole.permissions.trim() ? 'Permissions are required.' : ''}
          style={{ width: '100%', maxWidth: '400px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRole}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          Add Role
        </Button>
      </div>

      {/* Table to display roles */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Role Name</strong></TableCell>
              <TableCell><strong>Permissions</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.permissions.join(', ')}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    style={{ marginRight: '10px', width: '150px' , marginBottom:"5px" }}
                    onClick={() => handleOpenDialog(role)}
                  >
                    Update Role
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ width: '150px' }}
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    Delete Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Updating Role */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Role Permissions</DialogTitle>
        <DialogContent>
          <TextField
            label="Permissions (comma-separated)"
            value={currentRole?.permissions || ''}
            onChange={(e) => setCurrentRole({
              ...currentRole,
              permissions: e.target.value
            })}
            fullWidth
            multiline
            rows={4}
            style={{ marginBottom: '20px' }}
            error={touched && !currentRole?.permissions.trim()} // Show error if the field is touched and empty
            helperText={touched && !currentRole?.permissions.trim() ? 'Permissions are required.' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateRole} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Error/Info Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RoleManagement;
