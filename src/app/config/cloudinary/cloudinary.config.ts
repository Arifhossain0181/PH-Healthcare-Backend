import {v2 as cloudinary, UploadApiResponse} from 'cloudinary';
import { envVars } from '../env';
import { console } from 'inspector/promises';
import APPError from '../../errorhelPers/APPError';
import status from 'http-status';
cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})
export const deletefilecloudinary = async (url: string) => {try{
    
       const regex = /\/([^/]+)\.[^/]+$/;
         const match = url.match(regex);
         if(match && match[1]){
            const publicId = match[1];
            await cloudinary.uploader.destroy(publicId,{
                resource_type: 'image'
            })
            console.log("File deleted successfully");
         }
}
catch(error){
    console.error("Error deleting file:", error);
    throw error
}}
export const uploadToCloudinary = async (buffer:string ,fileName:string ) : Promise<UploadApiResponse> => {
    if(!buffer || !fileName){
        throw new Error("Buffer and fileName are required for uploading to Cloudinary");
    }
    try{
        const extension = fileName.split('.').pop()?.toLocaleLowerCase();
        const fileNameWithoutextension = fileName.split('.').slice(0, -1).join('.').toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
        ;
        const uniqueName = Math.random().toString(36).substring(2, 8)+"_"+ Date.now() + "_" + fileNameWithoutextension
        ;
        const folder = extension === "pdf" ? "pdfs" : "images";
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: extension === "pdf" ? "raw" : "image",
                public_id: `${folder}/${uniqueName}`,
                overwrite: true,
            }, (error, result) => {
                if (error) {
                   return reject(error)
                }
                resolve(result as UploadApiResponse);
            }
            ).end(buffer);
        })
        


    }
    catch(error){
        console.error("Error uploading file to Cloudinary:", error);
        throw new APPError("Failed to upload file", status.INTERNAL_SERVER_ERROR);
    }
}
export const cloudinaryConfig = cloudinary