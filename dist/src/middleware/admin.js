"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
exports.admin = {
    checkAdmin: function (req, res, next) {
        console.log(req.user);
        if (req.user.role == 'admin') {
            next();
        }
        else {
            res.redirect('/admin/list-users');
        }
    }
};
//# sourceMappingURL=admin.js.map