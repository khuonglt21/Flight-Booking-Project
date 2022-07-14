import express from "express";
import User from "../schemas/User.model";
const router = express.Router();

router.get('/list-users', async(req, res) => {
    const users = await User.find();
    console.log(users);
})

export default router