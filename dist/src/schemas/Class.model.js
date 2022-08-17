"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const classSchema = new mongoose_1.Schema({
    class: { type: String, unique: true, required: true },
});
const classModel = (0, mongoose_1.model)('Class', classSchema);
exports.default = classModel;
//# sourceMappingURL=Class.model.js.map