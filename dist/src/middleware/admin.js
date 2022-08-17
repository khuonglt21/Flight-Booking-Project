"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
exports.admin = {
    checkAdmin: function (req, res, next) {
        if (req.user.role == 'admin') {
            next();
        }
        else {
            res.redirect('/home/booking');
        }
    }
};
//# sourceMappingURL=admin.js.map