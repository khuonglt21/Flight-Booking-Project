"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: [true, "Missing first name"] },
    lastName: { type: String, required: [true, "Missing last name"] },
    phone: { type: Number, required: [true, "Missing phone"] },
    email: { type: String, required: [true, "Missing email"] },
    paymentMethod: { type: String }
});
const contactModel = mongoose_1.default.model('Contact', contactSchema);
exports.contactModel = contactModel;
//# sourceMappingURL=Contact.model.js.map