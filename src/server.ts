import app from './app';
import dotenv from 'dotenv';
import { seedsuPderAdmin } from './app/ulitis/seeduPderAdmin';
import { Server } from 'node:http';

dotenv.config();

const PORT = process.env.PORT 
 
let server :Server
const bootstrap = async () => {
    try{ 
        await seedsuPderAdmin()
      server=  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
    }
    catch(error){
        console.error('Error starting the server:', error);
    }
}
//SIGTERM signal handler for graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    if(server){
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
// SIGINT signal handler for graceful shutdown
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    if(server){
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
// uncaught excePtion hander 
process.on('uncaughtException',(error) =>{
    console.log("uncaught excePtion detected .. shutting down server " ,error)
    if(server){
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)


})
// unhandle rejection handler 
process.on('unhandledRejection',(error) =>{
    console.log("unhandled rejection detected .. shutting down server " ,error)
    if(server){
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
bootstrap();