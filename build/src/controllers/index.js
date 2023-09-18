"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use("/", router_1.default);
async function init(PORT, callback) {
    app.listen(PORT, () => console.log(`Server is live at http://localhost:${PORT}`));
    callback();
}
exports.init = init;
