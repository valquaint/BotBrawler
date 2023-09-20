import mongoose, { connection } from 'mongoose';
const db = mongoose.connection;
let bots:mongoose.Model<any>|null = null; // TODO : turn into collections array
const botData = new mongoose.Schema({
    "totalMatches" : Number,
    "wins" : Number,
    "losses" : Number,
    "knockouts" : Number,
    "AKT" : Number,
    "nKA" : Number,
    "nKAP" : Number,
    "JDW" : Number
})
const schema = new mongoose.Schema({
    "botName" : String,
    "careerData":botData,
    "seasonalData":[botData]
})
export async function init(URI:string){
    await mongoose.connect(URI)
    .then(()=> {
        console.log('The connection with mongod is established')
    })
    
}

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected'))
db.on('disconnected', () => console.log('mongo disconnected'))

export async function dropCollection(collection:string){
    console.log("Dropping collection::: ",collection);
    return await db.dropCollection(collection)
}

export async function createCollection(collection:string){
    const result = await db.createCollection(collection);
    console.log("Creating new collection::: ",collection);
    return result;
}

export async function insertMany(collection: string, data:any){
    return await db.collection(collection).insertMany(data);
}

export async function insert(collection: string, data:any){
    return await db.collection(collection).insertOne(data);
}

export async function find(filters?:any, projections?:any){
    if(bots===null){
        bots = mongoose.model('bots',schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.find(filters || {}, projections || {}).exec();
    return query;
}

export async function findOne(filters?:any, projections?:any){
    if(bots===null){
        bots = mongoose.model('bots',schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.findOne(filters || {}, projections || {}).exec();
    return query;
}

export async function updateOne(filters?:any, update?:any){
    if(bots===null){
        bots = mongoose.model('bots',schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.findOneAndUpdate(filters || {}, update || {}).exec();
    return query;
}

export async function updateMany(filters?:any, update?:any){
    if(bots===null){
        bots = mongoose.model('bots',schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.updateMany(filters || {}, update || {}).exec();
    return query;
}

export async function deleteOne(filters?:any){
    if(bots===null){
        bots = mongoose.model('bots',schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.findOneAndDelete(filters || {}).exec();
    return query;
}

export async function deleteMany(filters?:any){
    if(bots===null){
        bots = mongoose.model('bots',schema); // TODO: Apply collections array to schemas
    }
    const query = await bots.deleteMany(filters || {}).exec();
    return query;
}