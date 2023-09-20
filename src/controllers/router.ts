import { Router, static as eStatic } from 'express';
import * as path from 'node:path'
import * as mongo from '../classes/mongo'
const router = Router();
router.use("/css/", eStatic("./build/public/css"))
router.get("/", async (req, res) => {
    const bots = await mongo.find(null, {_id:0});
    console.log(bots);
    res.render("index.ejs", {bots:bots});
})

router.get("/bot/", (req, res) => {

})
router.get("/bot/:name", (req, res) => {

})
router.get("/bot/:id/edit", (req, res) => {

})
router.get("/bot/new", (req, res) => {

})
router.get("/bot/fight", (req, res) => {

})
router.get("/bot/simulate", (req, res) => {

})
router.post("/bot/", (req, res) => {

})
router.post("/bot/fight", (req, res) => {

})
router.delete("/bot/:id", (req, res) => {

})
router.put("/bot/:id", (req, res) => {

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