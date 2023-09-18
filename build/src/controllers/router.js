"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.render("index.ejs", {});
});
router.get("/", (req, res) => {
});
router.get("/bot/", (req, res) => {
});
router.get("/bot/:name", (req, res) => {
});
router.get("/bot/:id", (req, res) => {
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
exports.default = router;
