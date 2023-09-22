import { Router, static as eStatic, urlencoded } from 'express';
import * as path from 'node:path'
import * as mongo from '../classes/mongo'
import methodOverride from 'method-override';

interface Season {
    [key: string]: {
        "Name"?: String,
        "totalMatches"?: Number,
        "wins"?: Number,
        "losses"?: Number,
        "knockouts"?: Number,
        "AKT"?: Number,
        "nKA"?: Number,
        "nKAP"?: Number,
        "JDW"?: Number
    }
}

function strip_id(obj: any) {
    let result = obj;
    console.log("Stripping ID from object");
    for (const prop in result) {
        if (prop === "_id") {
            console.log("ID found. Deleting.");
            delete result[prop];
        } else {
            console.log(`typeof ${prop} is ${typeof result[prop]}`);
            if (typeof result[prop] === "object") {
                console.log(` === Recursively searching: ${result[prop]} === `)
                result[prop] = strip_id(result[prop] );
            }
        }
    }
    return result;
}

const router = Router();
router.use("/css/", eStatic("./build/public/css"));
router.use(methodOverride("_method"));
router.use(urlencoded({ extended: true }))
router.get("/", (req, res) => {
    res.render("index.ejs")
})

router.get("/bots", async (req, res) => {
    const bots = await mongo.find(null, { _id: 0 });
    console.log(bots);
    res.render("bots.ejs", { bots: bots });
})


router.get("/bots/new", (req, res) => {
    res.render("new.ejs")
})

router.post("/bots/new", async (req,res) => {
    const botName = req.body.name;
    delete req.body.name;
    const careerData = req.body;
    const result = (await mongo.insert("bots",{botName: botName, careerData: careerData, seasonalData: []}))
    console.log(result);
    res.redirect(`/bots/${botName}`);
})
router.get("/bots/new/season", (req, res) => {

})

router.get("/bots/fight", (req, res) => {

})
router.post("/bots/fight", (req, res) => {

})
router.get("/bots/simulate", (req, res) => {

})

router.get("/bots/:search", async (req, res) => {

    let find = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }));
    res.render("view.ejs", { bot: find._doc });
})

router.get("/bots/:search/edit", async (req, res) => {

    let find = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }));
    res.render("edit.ejs", { bot: find, index: req.params.search });
})

router.put("/bots/:search/update", async (req, res) => {
    const season = req.body.season;
    delete req.body.season;
    console.log({ $set: {[season] : req.body} });
    const values: Season = {};
    for (const value in req.body) {
        req.body[value] = parseInt(req.body[value]) || req.body[value];
    }
    console.log("VALUES")
    console.log({ $set: {[season] : values} });
    console.log("==")
    let oldBot = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }));
    oldBot.seasonalData.find((oldSeason:any, index:number) => {
        console.log("Find:")
        if(`${Object.keys(oldSeason)}` === season){
            oldBot.seasonalData[index] = {[season]:req.body};
            console.log(`Found at ${index}`)
        }
    })
    let update = (await mongo.updateOne({ botName: req.params.search }, { $set: {seasonalData:oldBot.seasonalData} }))._doc;
    console.log(update);
    res.redirect(`/bots/${req.params.search}`);
})
router.get("/bots/:search/data", async (req, res) => {

    let find = (await mongo.findOne({ botName: req.params.search }, { _id: 0 }))._doc;
    const result = strip_id(find);
    console.log(result);
    res.send(result);
})

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
        } catch (err) {
            res.status(500).send("<h1>Server 500 Error</h1>Unable to seed database. Possible database is offline, or seed file not found on server.");
            return;
        }

    }
    res.sendStatus(404);
})
export default router;