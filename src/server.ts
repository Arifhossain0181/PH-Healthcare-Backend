import app from './app';
import dotenv from 'dotenv';
import { seedsuPderAdmin } from './app/ulitis/seeduPderAdmin';

dotenv.config();

const PORT = process.env.PORT 

const bootstrap = async () => {
    try{ 
        await seedsuPderAdmin()
        app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
    }
    catch(error){
        console.error('Error starting the server:', error);
    }
}
bootstrap();