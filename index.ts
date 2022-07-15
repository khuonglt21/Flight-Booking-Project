import express from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import appRoot from "app-root-path";
import {logger} from "./src/logger/winston";
import passport from "./src/middleware/passport"
import errorControllers from "./src/controllers/errorControllers";
const appRootPath = appRoot.path;
import path from "path";
import authRouter from "./src/router/authRouter"
import session from "express-session";
import auth from "./src/middleware/auth";
import productRouter from "./src/router/productRouter";
import adminRouter from "./src/router/adminRouter";
import {admin} from "./src/middleware/admin";
import dotenv from "dotenv";
import createFlightRouter from "./src/router/createFlight.router";
dotenv.config();
import connectDB from "./src/config/db";

const app = express();
const PORT = process.env.PORT || 3000;

// setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// setup view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// setup static file
app.use('/public', express.static(path.join(appRootPath, "src", 'public')));

// setup using session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000}
}));

// setup passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRouter);
app.use('/home', productRouter);//get in home page
app.use('/flight', createFlightRouter);//get in home page
// app.use('/admin',auth.checkAuth,admin.checkAdmin,adminRouter);

// connect DB
connectDB();

app.use(errorControllers.errorRender);

app.listen(PORT, () => {
    console.log(`You are listening on port: ${PORT}`);
});