const multer = require('multer');

const streamifier = require('streamifier');

const cloudinary = require('./Cloudinary.config');



// Multer configuration to store files in memory

const storage = multer.memoryStorage();



const upload = multer({

  storage: storage

});



// Helper to upload a file buffer to Cloudinary

const uploadToCloudinary = (file, folder = 'default') => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(

      { folder:  'drive-222ea'},

      (error, result) => {

        if (error) {

          reject(error);

        } else {

          resolve(result);

        }

      }

    );



    stream.end(file.buffer);



  });

};



module.exports = {

  upload,

  uploadToCloudinary

};
