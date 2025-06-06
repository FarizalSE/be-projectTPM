import express from "express";
import {
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionByUserId
} from "../controllers/TransactionController.js";

const router = express.Router();

router.get('/transaction', getTransaction);
router.post('/add-transaction', addTransaction);
router.put("/update-transaction/:id",updateTransaction);
router.delete('/delete-transaction/:id', deleteTransaction);
router.get('/transactions/:userId', getTransactionByUserId);

export default router;