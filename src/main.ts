import * as controller from './controllers';
require('dotenv').config();
const PORT:number = process.env.PORT as unknown as number;
controller.init(PORT||4006,() => {console.log("Initialized Controllers")});