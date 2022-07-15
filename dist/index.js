"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const passport_1 = __importDefault(require("./src/middleware/passport"));
const errorControllers_1 = __importDefault(require("./src/controllers/errorControllers"));
const appRootPath = app_root_path_1.default.path;
const path_1 = __importDefault(require("path"));
const authRouter_1 = __importDefault(require("./src/router/authRouter"));
const express_session_1 = __importDefault(require("express-session"));
const productRouter_1 = __importDefault(require("./src/router/productRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const createFlight_router_1 = __importDefault(require("./src/router/createFlight.router"));
dotenv_1.default.config();
const db_1 = __importDefault(require("./src/config/db"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use('/public', express_1.default.static(path_1.default.join(appRootPath, "src", 'public')));
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/auth', authRouter_1.default);
app.use('/home', productRouter_1.default);
app.use('/flight', createFlight_router_1.default);
(0, db_1.default)();
app.use(errorControllers_1.default.errorRender);
app.listen(PORT, () => {
    console.log(`You are listening on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map