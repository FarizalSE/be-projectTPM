import express from "express";
import {
    getUserById,
    getUsers,
    createUser,
    deleteUser,
    loginHandler,
    updateUser,
    logout,
} from "../controllers/UserController.js";

const router = express.Router();

// Auth routes
router.post('/login', loginHandler);
router.delete('/logout', logout);
router.post('/register', createUser);

// RESTful user endpoints
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);    // ✅ Ganti jadi /users/:id
router.put('/users/:id', updateUser);       // ✅ Ganti jadi /users/:id

export default router;
