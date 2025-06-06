import express from "express";
import {
    getWeapons,
    getWeaponById,
    addWeapons,
    updateWeapons,
    deleteWeapons,
} from "../controllers/WeaponController.js";

const router = express.Router();

//endpoint khusus
router.get('/weapons', getWeapons);
router.get('/weapons/:id', getWeaponById);
router.post('/add-weapons', addWeapons);
router.put('/update-weapons', updateWeapons);
router.delete('/delete-weapons/:id', deleteWeapons);

export default router;