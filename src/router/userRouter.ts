import express from "express";
import userController from "../controllers/userController";
const router = express.Router();
import multer from "multer"

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img/avatar')
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname)
    }
})

const upload = multer({ storage: storage })

router.get('/buy-history',userController.displayHistory)

router.get('/info',userController.showInfo);

router.post('/info',upload.single('avatarUrl'),userController.editInfo)

export default router;