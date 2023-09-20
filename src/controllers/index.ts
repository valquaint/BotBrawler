import express from 'express';
import router from './router';

const app = express();

app.use("/", router)

export async function init(PORT:number, callback:Function){
    app.listen(PORT, () => console.log(`Server is live at http://localhost:${PORT}`));
    await callback();
}