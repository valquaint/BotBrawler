"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongo = __importStar(require("../classes/mongo"));
const router = (0, express_1.Router)();
router.use("/css/", (0, express_1.static)("./build/public/css"));
router.get("/", async (req, res) => {
    const bots = await mongo.find(null, { _id: 0 });
    console.log(bots);
    res.render("index.ejs", { bots: bots });
});
router.get("/bot/", (req, res) => {
});
router.get("/bot/:name", (req, res) => {
});
router.get("/bot/:id/edit", (req, res) => {
});
router.get("/bot/new", (req, res) => {
});
router.get("/bot/fight", (req, res) => {
});
router.get("/bot/simulate", (req, res) => {
});
router.post("/bot/", (req, res) => {
});
router.post("/bot/fight", (req, res) => {
});
router.delete("/bot/:id", (req, res) => {
});
router.put("/bot/:id", (req, res) => {
});
router.get("/seed/:file", async (req, res) => {
    if (req.rawHeaders[1].indexOf("localhost") !== -1) {
        try {
            const seed = (await import(`../models/${req.params.file}`)).default.default;
            console.log(seed);
            console.log(await mongo.dropCollection("bots"));
            console.log(await mongo.createCollection("bots"));
            console.log(await mongo.insertMany("bots", seed));
            res.send(`Seeded database from file successfully. ${seed.length} entries added to the database.`);
            return;
        }
        catch (err) {
            res.status(500).send("<h1>Server 500 Error</h1>Unable to seed database. Possible database is offline, or seed file not found on server.");
            return;
        }
    }
    res.sendStatus(404);
});
exports.default = router;
