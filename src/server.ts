import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT,()=>{
    console.log(`App is listening at port ${env.PORT}`)
})