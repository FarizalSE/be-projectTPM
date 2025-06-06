import express from "express";
import {
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionByUserId
} from "../controllers/TransactionController.js";

const router = express.Router();

// ✅ RESTful routes
router.get('/transactions', getTransaction);                   // Get all
router.post('/transactions', addTransaction);                  // Create
router.put("/transactions/:id", updateTransaction);            // Update
router.delete('/transactions/:id', deleteTransaction);         // Delete
router.get('/transactions/user/:userId', getTransactionByUserId); // Filter by user

export default router;
