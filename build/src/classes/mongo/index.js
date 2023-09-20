"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMany = exports.deleteOne = exports.updateMany = exports.updateOne = exports.findOne = exports.find = exports.insert = exports.insertMany = exports.createCollection = exports.dropCollection = exports.init = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db = mongoose_1.default.connection;
let bots = null; // TODO : turn into collections array
const botData = new mongoose_1.default.Schema({
    "totalMatches": Number,
    "wins": Number,
    "losses": Number,
    "knockouts": Number,
    "AKT": Number,
    "nKA": Number,
    "nKAP": Number,
    "JDW": Number
});
const schema = new mongoose_1.default.Schema({
    "botName": String,
    "careerData": botData,
    "seasonalData": [botData]
});
async function init(URI) {
    await mongoose_1.default.connect(URI)
        .then(() => {
        console.log('The connection with mongod is established');
    });
}
exports.init = init;
// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));
async function dropCollection(collection) {
    console.log("Dropping collection::: ", collection);
    return await db.dropCollection(collection);
}
exports.dropCollection = dropCollection;
async function createCollection(collection) {
    const result = await db.createCollection(collection);
    console.log("Creating new collection::: ", collection);
    return result;
}
exports.createCollection = createCollection;
async function insertMany(collection, data) {
    return await db.collection(collection).insertMany(data);
}
exports.insertMany = insertMany;
async function insert(collection, data) {
    return await db.collection(collection).insertOne(data);
}
exports.insert = insert;
async function find(filters, projections) {
    if (bots === null) {
        bots = mongoose_1.default.model('bots', schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.find(filters || {}, projections || {}).exec();
    return query;
}
exports.find = find;
async function findOne(filters, projections) {
    if (bots === null) {
        bots = mongoose_1.default.model('bots', schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.findOne(filters || {}, projections || {}).exec();
    return query;
}
exports.findOne = findOne;
async function updateOne(filters, update) {
    if (bots === null) {
        bots = mongoose_1.default.model('bots', schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.findOneAndUpdate(filters || {}, update || {}).exec();
    return query;
}
exports.updateOne = updateOne;
async function updateMany(filters, update) {
    if (bots === null) {
        bots = mongoose_1.default.model('bots', schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.updateMany(filters || {}, update || {}).exec();
    return query;
}
exports.updateMany = updateMany;
async function deleteOne(filters) {
    if (bots === null) {
        bots = mongoose_1.default.model('bots', schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.findOneAndDelete(filters || {}).exec();
    return query;
}
exports.deleteOne = deleteOne;
async function deleteMany(filters) {
    if (bots === null) {
        bots = mongoose_1.default.model('bots', schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.deleteMany(filters || {}).exec();
    return query;
}
exports.deleteMany = deleteMany;
