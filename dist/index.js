"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const winston_1 = require("./src/logger/winston");
const passport_1 = __importDefault(require("./src/middleware/passport"));
const appRootPath = app_root_path_1.default.path;
const path_1 = __importDefault(require("path"));
const authRouter_1 = __importDefault(require("./src/router/authRouter"));
const express_session_1 = __importDefault(require("express-session"));
const productRouter_1 = __importDefault(require("./src/router/productRouter"));
const DB_URL = 'mongodb+srv://root:Password@cluster0.l1wd2.mongodb.net/?retryWrites=true&w=majority';
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use('/public', express_1.default.static(path_1.default.join(appRootPath, "src", 'public')));
app.use(passport_1.default.initialize());
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(passport_1.default.session());
mongoose_1.default.connect(DB_URL).then(() => {
    console.log('Connected to database');
}).catch(err => {
    winston_1.logger.error(err);
});
app.use('/auth', authRouter_1.default);
app.use('/home', productRouter_1.default);
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
//# sourceMappingURL=index.js.map