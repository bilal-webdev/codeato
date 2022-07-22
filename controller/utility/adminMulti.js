const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/assets/adminCourse');
    },
    filename: function (req, file, cb) {
      let modifiedName = `course-${Date.now()+path.extname(file.originalname)}`;
      cb(null, modifiedName);
    }
});

  
let adminUpload = multer({ 
    storage: storage,
    fileFilter: function fileFilter(req, file, cb){
        let filetypes = /png|jpg|jpeg|gif|svg/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if(mimetype && extname) return cb(null, true);
        cb(`Only ${filetypes} are accepted...`);
    }  
});

module.exports = adminUpload;