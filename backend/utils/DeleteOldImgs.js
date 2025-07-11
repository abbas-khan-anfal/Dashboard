import { v2 as cloudinary } from 'cloudinary';

// function to delete old images
const DeleteOldImgs = async (uploadedFiles) => {
    try
    {
        if(Object.keys(uploadedFiles).length > 0)
        {
            const postImgPubIds = Object.keys(uploadedFiles)
            .filter(file => uploadedFiles[file]?.[0]?.filename)
            .map(file => uploadedFiles[file][0].filename);

            if(postImgPubIds.length > 0)
            {
                const deleteImages = postImgPubIds.map(pubId => cloudinary.uploader.destroy(pubId));
                await Promise.all(deleteImages);
            }
            console.log("Old images deleted successfully");
        }
        else
        {
            console.log("No old images to delete");
        }
    }
    catch(error)
    {
        console.log(`Error deleting old images : ${error}`);
    }
}

export default DeleteOldImgs;