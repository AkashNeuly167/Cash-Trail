import multer from "multer";

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb) => {
        cb(null,`${Date.now() + '-' + file.originalname}`);
    },
})

const fileFilter = (req,file,cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error('Only JPEG, JPG and PNG files are allowed'),false);
  }
}

export const upload = multer({storage,fileFilter});