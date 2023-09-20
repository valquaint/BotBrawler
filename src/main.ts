import * as controller from './controllers';
import * as mongo from './classes/mongo';
require('dotenv').config();
const PORT:number = process.env.PORT as unknown as number;

(async () => {
    await controller.init(PORT||4006,mongo.init.bind(this,process.env.MONGO_URI as unknown as string));
})().catch(e => {
    console.log(`Application has encountered a critical error and could not start.`);
    console.error(e);
});