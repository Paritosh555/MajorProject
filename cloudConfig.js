const cloudinary = require('cloudinary').v2;// cloudinary package reqire
const { CloudinaryStorage } = require('multer-storage-cloudinary');// multer storage package require


cloudinary.config({

    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',  // hya folder madhe je image upload kru te cloud la store hoil ha folder apn kontehe name devu shakto
      allowerdFormat: ["png","jpg","jpeg"], // ya madhe apn kontya filee
    },
  });

  module.exports ={
    cloudinary,
    storage
  };