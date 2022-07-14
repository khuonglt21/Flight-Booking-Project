import express from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import appRoot from "app-root-path";
import { logger } from "./src/logger/winston";
import passport from "./src/middleware/passport"
const appRootPath = appRoot.path;
import path from "path";
import authRouter from "./src/router/authRouter"
import session from "express-session";
import auth from "./src/middleware/auth";
import productRouter from "./src/router/productRouter";
import adminRouter from "./src/router/adminRouter";
import {admin} from "./src/middleware/admin";
const DB_URL ='mongodb+srv://root:Password@cluster0.l1wd2.mongodb.net/?retryWrites=true&w=majority'
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', './src/views');

// console.log(path.join(appRootPath, "src", 'public'))
app.use('/public', express.static(path.join(appRootPath, "src", 'public')));

app.use(passport.initialize());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000}
}));

app.use(passport.session());

mongoose.connect(DB_URL).then(()=>{
    console.log('Connected to database')
}).catch(err => {
    logger.error(err)
});

app.use('/auth',authRouter);
app.use('/home',productRouter);//get in home page
// app.use('/admin',auth.checkAuth,admin.checkAdmin,adminRouter);

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});