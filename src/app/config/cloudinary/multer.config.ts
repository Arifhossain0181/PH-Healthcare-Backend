import {CloudinaryStorage} from 'multer-storage-cloudinary';
import {cloudinaryConfig} from './cloudinary.config';
import multer from 'multer';
const storage = new CloudinaryStorage({
    cloudinary: cloudinaryConfig,
    params: async (req, file) => {
        const originName = file.originalname 
        const extention = originName.split('.').pop()?.toLocaleLowerCase();
        const fileNamewithoutExt = originName.split('.').slice(0, -1).join('.').toLocaleLowerCase().replace(/\s/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        const uniquename =  Math.random().toString(36).substring(2, 15)+"_"+Date.now()+
        "_"+fileNamewithoutExt
   const folder = extention === 'pdf' ? 'pdf_files' : 'image_files';
        return {
            folder: `ph-healthcare/${folder}`,
            public_id: uniquename,
            resource_type: extention === 'pdf' ? 'raw' : 'auto'
        }
    }
})
export const multerConfig = multer({storage})
