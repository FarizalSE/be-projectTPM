import express from "express";
import {
    getWeapons,
    getWeaponById,
    addWeapons,
    updateWeapons,
    deleteWeapons,
    getSummary
} from "../controllers/WeaponController.js";

const router = express.Router();

//endpoint khusus
router.get('/weapons', getWeapons);
router.get('/weapons/:id', getWeaponById);
router.post('/weapons', addWeapons);
router.put('/weapons/:id', updateWeapons);
router.delete('/weapons/:id', deleteWeapons);
router.get('/summary', getSummary)


export default router;