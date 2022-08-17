"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const passport_1 = __importDefault(require("./src/middleware/passport"));
const errorControllers_1 = __importDefault(require("./src/controllers/errorControllers"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const appRootPath = app_root_path_1.default.path;
const path_1 = __importDefault(require("path"));
const authRouter_1 = __importDefault(require("./src/router/authRouter"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = __importDefault(require("./src/middleware/auth"));
const productRouter_1 = __importDefault(require("./src/router/productRouter"));
const adminRouter_1 = __importDefault(require("./src/router/adminRouter"));
const admin_1 = require("./src/middleware/admin");
const dotenv_1 = __importDefault(require("dotenv"));
const createFlight_router_1 = __importDefault(require("./src/router/createFlight.router"));
dotenv_1.default.config();
const db_1 = __importDefault(require("./src/config/db"));
const userRouter_1 = __importDefault(require("./src/router/userRouter"));
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(setLayouts);
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.set("layout", path_1.default.join("layouts", "layout"));
function setLayouts(req, res, next) {
    const routes = ["auth", 'user', 'admin', 'flight', 'public'];
    const baseUrl = req.originalUrl.split('/')[1];
    if (routes.includes(baseUrl)) {
        next();
    }
    else {
        return (0, express_ejs_layouts_1.default)(req, res, next);
    }
}
app.use('/public', express_1.default.static(path_1.default.join(appRootPath, "src", 'public')));
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/', (req, res) => {
    return res.redirect("/home/booking");
});
app.get('/home', (req, res) => {
    return res.redirect("/home/booking");
});
app.use('/auth', authRouter_1.default);
app.use('/home', productRouter_1.default);
app.use('/flight', createFlight_router_1.default);
app.use('/admin', auth_1.default.checkAuth, admin_1.admin.checkAdmin, adminRouter_1.default);
app.use('/user', auth_1.default.checkAuth, userRouter_1.default);
app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/home/booking');
    });
});
(0, db_1.default)();
app.use((req, res, next) => {
    next('err');
});
app.use(errorControllers_1.default.errorRender);
app.listen(PORT, () => {
    console.log(`You are listening on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map