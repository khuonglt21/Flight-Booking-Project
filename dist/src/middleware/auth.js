"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth = {
    checkAuth: function (req, res, next) {
        if (req.isAuthenticated) {
            next();
        }
        else {
            res.redirect('/auth/login');
        }
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map