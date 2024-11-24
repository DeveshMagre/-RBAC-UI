# User and Role Management System

This project provides a web application for managing users and roles in an organization. It allows administrators to add, edit, and delete users, as well as manage roles and permissions associated with them. The application uses **React** for the frontend and **Axios** for making API requests to a backend server.

## Features

- **User Management**:
  - Add, edit, and delete users.
  - Fields: Name, Email, Role, Status (Active/Inactive).
  - Validation for input fields (e.g., name can only contain alphabetic characters).
  
- **Role Management**:
  - Add, update, and delete roles.
  - Assign multiple permissions to roles (comma-separated).
  - View roles with their associated permissions.

- **Material-UI Components**:
  - Uses Material-UI components for a responsive and clean user interface.

## Prerequisites

Before you can run the project, make sure you have the following installed:

- **Node.js** (LTS version)
- **npm** (or **yarn** as an alternative)

If you haven't installed them yet, you can download Node.js from [here](https://nodejs.org/).

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/DeveshMagre/user-role-management.git
    ```

2. Navigate to the project directory:

    ```bash
    cd rbac-ui
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Set up your backend API. This application expects an API running locally on `http://localhost:3000` with the following endpoints:
    - `GET /users` — Fetch all users.
    - `POST /users` — Add a new user.
    - `PUT /users/:id` — Update a user.
    - `DELETE /users/:id` — Delete a user.
    - `GET /roles` — Fetch all roles.
    - `POST /roles` — Add a new role.
    - `PUT /roles/:id` — Update a role.
    - `DELETE /roles/:id` — Delete a role.

   You will need to set up a backend server that handles these routes. If you don't have a backend setup, you can create one with **Express** or any other backend framework you prefer.

5. Run the development server:

    ```bash
    npm start
    ```

6. The application should now be running on `http://localhost:3000` in your web browser.

## Usage

- **User Management**:
  - You can add a new user by filling in the Name, Email, Role, and Status fields and clicking the "Add User" button.
  - Existing users can be edited by clicking the "Edit" button in the table row, and their information will be displayed in a dialog box for modification.
  - Users can be deleted by clicking the "Delete" button.

- **Role Management**:
  - You can add a new role by filling in the Role Name and Permissions fields (permissions are comma-separated) and clicking the "Add Role" button.
  - Roles can be updated by clicking the "Update Role" button, which opens a dialog to edit permissions.
  - Roles can be deleted by clicking the "Delete Role" button.

## API Integration

This application uses the following API functions for communication with the backend:

- **Users**:
  - `fetchUsers()`: Fetch all users.
  - `addUser(user)`: Add a new user.
  - `updateUser(id, user)`: Update a user by ID.
  - `deleteUser(id)`: Delete a user by ID.

- **Roles**:
  - `fetchRoles()`: Fetch all roles.
  - `addRole(role)`: Add a new role.
  - `updateRole(id, role)`: Update a role by ID.
  - `deleteRole(id)`: Delete a role by ID.






