import express from "express";
const router = express.Router();

router.get('/booking', (req, res) => {
    res.render('home')
});

router.get('/support',((req, res) => {
    res.render('demo')
}))


export default router