import { v2 as cloudinary } from "cloudinary";
import path from 'path';
import settingModel from "../../models/settings/SettingModel.js";
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';
import validator from 'validator';
import mongoose from "mongoose";

const deleteFile = async (publicId) => {
    if(publicId)
    {
        try
        {
            const result = await cloudinary.uploader.destroy(publicId);
            if(result.result === 'ok')
            {
                console.log(`File deleted successfully`);
            }
            return;
        }
        catch(error)
        {
            console.log(`Error deleting file : `, error);
        }
    }
};

export const updateSiteSettings = async (req, res, next) => {
    try
    {
        const { site_name, site_copyright, site_email, site_address, site_phone, site_description, site_youtube, site_instagram, site_twitter, site_facebook, site_linkedin, site_pinterest, id } = req.body;
        const Image = req.file || {}; // Handle case where no file is uploaded

        if(!mongoose.isValidObjectId(id))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "Invalid settings id", 400);
        }

        if(site_email && !validator.isEmail(site_email))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like your email is incorrect", 400);
        }
        if(site_phone && !validator.isMobilePhone(site_phone, 'any', { strictMode: false }))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like phone number is incorrect", 400);
        }
        // also check url through validator
        if(site_youtube && !validator.isURL(site_youtube))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like your youtube link is incorrect", 400);
        }
        if(site_instagram && !validator.isURL(site_instagram))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like your instagram link is incorrect", 400);
        }
        if(site_twitter && !validator.isURL(site_twitter))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like your twitter link is incorrect", 400);
        }
        if(site_facebook && !validator.isURL(site_facebook))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like your facebook link is incorrect", 400);
        }
        if(site_linkedin && !validator.isURL(site_linkedin))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like your linkedin link is incorrect", 400);
        }
        if(site_pinterest && !validator.isURL(site_pinterest))
        {
            if (Image.filename)
            {
                await deleteFile(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "It looks like your pinterest link is incorrect", 400);
        }
        // check the file size upto 5mb
        // if (Image.size && Image.size > 5000000)
        // {
        //     if (Image.filename)
        //     {
        //         await deleteFile(Image.filename);
        //         console.log(`New image deleted successfully`);
        //     }
        //     return ErrorResponse(res, "Image size should be less than 5mb", 400);
        // }


        // Validate required fields in a clean way
        if ([site_name, site_copyright, site_email, site_address, site_phone, site_description].some(field => !field?.trim()))
        {
            if (Image.filename)
            {
                await cloudinary.uploader.destroy(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "Please fill the required fields", 400);
        }

        // Check if settings exist
        const settings = await settingModel.findById(id);
        if (!settings) {
            if (Image.filename) {
                await cloudinary.uploader.destroy(Image.filename);
                console.log(`New image deleted successfully`);
            }
            return ErrorResponse(res, "Setting not found", 404);
        }

        let site_logo_img_path = settings.site_logo_img_path || "";
        let site_logo_img_pub_id = settings.site_logo_img_pub_id || "";

        // Handle new image upload
        if (Image.filename && Image.path)
        {
            if (site_logo_img_pub_id)
            {
                await cloudinary.uploader.destroy(site_logo_img_pub_id);
                console.log(`Old image deleted successfully`);
            }
            settings.site_logo_img_path = Image.path;
            settings.site_logo_img_pub_id = Image.filename;
        }

        // Update settings
        if(site_name && site_name !== settings.site_name)
        {
            settings.site_name = site_name;
        }
        if(site_copyright && site_copyright !== settings.site_copyright)
        {
            settings.site_copyright = site_copyright;
        }
        if(site_email && site_email !== settings.site_email)
        {
            settings.site_email = site_email.toLowerCase();
        }
        if(site_address && site_address !== settings.site_address)
        {
            settings.site_address = site_address;
        }
        if(site_phone && site_phone !== settings.site_phone)
        {
            settings.site_phone = site_phone;
        }
        if(site_description && site_description !== settings.site_description)
        {
            settings.site_description = site_description;
        }
        if(site_youtube !== settings.site_youtube)
        {
            settings.site_youtube = site_youtube;
        }
        if(site_instagram !== settings.site_instagram)
        {
            settings.site_instagram = site_instagram;
        }
        if(site_twitter !== settings.site_twitter)
        {
            settings.site_twitter = site_twitter;
        }
        if(site_facebook !== settings.site_facebook)
        {
            settings.site_facebook = site_facebook;
        }
        if(site_linkedin !== settings.site_linkedin)
        {
            settings.site_linkedin = site_linkedin;
        }
        if(site_pinterest !== settings.site_pinterest)
        {
            settings.site_pinterest = site_pinterest;
        }
        await settings.save();

        return SuccessResponse(res, "Settings updated successfully", 200);


    } catch (error) {
        return ErrorResponse(res, error.message, 500);
    }
};


export const fetchSingleSetting = async (req, res, next) => {
    try
    {
        const setting = await settingModel.findOne({}); // Fetch a single document

        if(!setting)
        {
            return ErrorResponse(res, "Setting not found", 404);
        }

        return res.status(200).json({
            success: true,
            data: setting
        });

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
};