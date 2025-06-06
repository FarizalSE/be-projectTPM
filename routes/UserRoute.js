import express from "express";
import {
    getUserById,
    getUsers,
    createUser,
    deleteUser,
    loginHandler,
    updateUser,
    logout,
} from  "../controllers/UserController.js";
const router = express.Router();

//endpoint authenticate
router.post('/login', loginHandler);
router.delete('/logout', logout);
router.post('/register', createUser);
//endpoint khusus verify token
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/delete-user/:id', deleteUser);
router.put('/update-user/:id', updateUser);

export default router;



