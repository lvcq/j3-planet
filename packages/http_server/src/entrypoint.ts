import { Application } from './deps.ts';
import routers from './routers.ts';

export async function start_server(){
    const app =new Application();
    app.use(routers.routes());
    app.use(routers.allowedMethods());

    console.log("http server start listening: 8000")

    await app.listen({
        port: 8000
    })    
}