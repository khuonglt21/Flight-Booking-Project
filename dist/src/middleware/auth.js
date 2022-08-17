"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth = {
    checkAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.isBanned) {
                return next({ code: 403, message: "You account has been banned" });
            }
            next();
        }
        else {
            res.redirect('/auth/login');
        }
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map