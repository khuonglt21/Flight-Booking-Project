import express from "express";
import {adminController} from "../controllers/adminController";
const router = express.Router();

router.get('/list-users',adminController.renderListUser);

router.get('/banned',adminController.bannedUser)

export default router