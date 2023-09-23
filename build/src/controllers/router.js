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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongo = __importStar(require("../classes/mongo"));
const method_override_1 = __importDefault(require("method-override"));
function strip_id(obj) {
    let result = obj;
    console.log("Stripping ID from object");
    for (const prop in result) {
        if (prop === "_id") {
            console.log("ID found. Deleting.");
            delete result[prop];
        }
        else {
            console.log(`typeof ${prop} is ${typeof result[prop]}`);
            if (typeof result[prop] === "object") {
                console.log(` === Recursively searching: ${result[prop]} === `);
                result[prop] = strip_id(result[prop]);
            }
        }
    }
    return result;
}
const router = (0, express_1.Router)();
router.use("/css/", (0, express_1.static)("./build/public/css"));
router.use((0, method_override_1.default)("_method"));
router.use((0, express_1.urlencoded)({ extended: true }));
router.get("/", (req, res) => {
    res.render("index.ejs");
});
router.get("/bots", async (req, res) => {
    const bots = await mongo.find(null, { _id: 0 });
    console.log(bots);
    res.render("bots.ejs", { bots: bots });
});
router.get("/bots/new", (req, res) => {
    res.render("new.ejs");
});
router.post("/bots/new", async (req, res) => {
    const botName = req.body.name;
    const botImg = req.body.img;
    delete req.body.img;
    delete req.body.name;
    const careerData = req.body;
    const result = (await mongo.insert("bots", { botName: botName, img: botImg, careerData: careerData, seasonalData: [] }));
    console.log(result);
    res.redirect(`/bots/${botName}`);
});
router.post("/bots/:search/edit/addseason", async (req, res) => {
    const season = req.body.season;
    delete req.body.season;
    // console.log({ $set: {[season] : req.body} });
    const values = {};
    for (const value in req.body) {
        req.body[value] = parseInt(req.body[value]) || req.body[value];
    }
    console.log("VALUES");
    console.log({ $set: { [season]: req.body } });
    console.log("==");
    let oldBot = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }));
    oldBot.seasonalData.push({ [season]: req.body });
    console.log(oldBot);
    let update = (await mongo.updateOne({ botName: req.params.search }, { $set: { seasonalData: oldBot.seasonalData } }))._doc;
    console.log(update);
    res.redirect(`/bots/${req.params.search}`);
});
router.get("/fight", (req, res) => {
    res.send("Coming Soon... Please return to the <a href='/'>Home Page</a>");
});
router.post("/fight", (req, res) => {
    res.send("Coming Soon... Please return to the <a href='/'>Home Page</a>");
});
router.get("/simulate", (req, res) => {
    res.send("Coming Soon... Please return to the <a href='/'>Home Page</a>");
});
router.delete("/bots/:search", async (req, res) => {
    let find = (await mongo.deleteOne({ botName: req.params.search }));
    console.log(find);
    res.redirect("/bots");
});
router.get("/bots/:search", async (req, res) => {
    let find = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }));
    res.render("view.ejs", { bot: find._doc });
});
router.get("/bots/:search/edit", async (req, res) => {
    let find = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }));
    res.render("edit.ejs", { bot: find, index: req.params.search });
});
router.put("/bots/:search/update", async (req, res) => {
    const season = req.body.season;
    delete req.body.season;
    console.log({ $set: { [season]: req.body } });
    const values = {};
    for (const value in req.body) {
        req.body[value] = parseInt(req.body[value]) || req.body[value];
    }
    console.log("VALUES");
    console.log({ $set: { [season]: values } });
    console.log("==");
    let oldBot = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }));
    oldBot.seasonalData.find((oldSeason, index) => {
        console.log("Find:");
        if (`${Object.keys(oldSeason)}` === season) {
            oldBot.seasonalData[index] = { [season]: req.body };
            console.log(`Found at ${index}`);
        }
    });
    let update = (await mongo.updateOne({ botName: req.params.search }, { $set: { seasonalData: oldBot.seasonalData } }))._doc;
    console.log(update);
    res.redirect(`/bots/${req.params.search}`);
});
router.get("/bots/:search/data", async (req, res) => {
    let find = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }))._doc;
    const result = strip_id(find);
    console.log(result);
    res.send(result);
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
router.get("/about", (req, res) => {
    res.send("About page coming soon. Please return to the <a href='/'>Home Page</a>");
});
exports.default = router;
