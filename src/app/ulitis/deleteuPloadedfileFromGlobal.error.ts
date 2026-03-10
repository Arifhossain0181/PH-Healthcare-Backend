import { Request } from "express";

import { deletefilecloudinary } from "../config/cloudinary/cloudinary.config";

export const deleteUploadedFileFromGlobalError = async (req: Request): Promise<void> => {
    try {
        const filesToDelete: string[] = [];

        // single file (multer single)
        if (req.file) {
            const file = req.file as Express.Multer.File;
            if (file.path) filesToDelete.push(file.path);
        }

        // named fields (multer.fields) -> object with arrays or single file
        else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
            const filesObj = req.files as { [field: string]: Express.Multer.File[] | Express.Multer.File };
            Object.values(filesObj).forEach((value) => {
                if (Array.isArray(value)) {
                    (value as Express.Multer.File[]).forEach((f) => {
                        if (f && f.path) filesToDelete.push(f.path);
                    });
                } else {
                    const f = value as Express.Multer.File;
                    if (f && f.path) filesToDelete.push(f.path);
                }
            });
        }

        // array of files (multer.array)
        else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            (req.files as Express.Multer.File[]).forEach((f) => {
                if (f && f.path) filesToDelete.push(f.path);
            });
        }

        if (filesToDelete.length > 0) {
            await Promise.all(filesToDelete.map((url) => deletefilecloudinary(url)));
            console.log(`\ndeleted ${filesToDelete.length} upload file(s) from cloudinary due to an error during request processing.\n`);
        }
    } catch (error: unknown) {
        console.error("error deleting uploaded files (global):", error);
    }
};
