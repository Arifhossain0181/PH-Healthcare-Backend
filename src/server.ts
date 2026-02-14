import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT 

const bootstrap = () => {
    try{
        app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
    }
    catch(error){
        console.error('Error starting the server:', error);
    }
}
bootstrap();