import express from 'express'; //Express for server 
import cors from 'cors'; //for allowing frontend requests
import multer from 'multer'; //handling file uploads
import path from 'path'; //helps us work with file and directory paths in a cross platform way
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express(); //Creating an app instance
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname= dirname(__filename);

app.use(cors());

//Configure Storage for uploaded audio
const storage  = multer.diskStorage({
    destination: (req,file,cb)=> cb(null,'uploads/'),
    filename: (req,file,cb)=>{
        const ext = path.extname(file.originalname);
        cb(null,`audio_${Date.now}${ext}`);
    }
});
const upload = multer({ storage });

//Create uploads folder if it doesn't exist

const uploadDir = path.join(__dirname,'uploads');
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
app.post('/upload-audio', upload.single('audio'),(req, res)=>{
    if(!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded'});
    }
    res.json({message:'Audio uploaded successfully',filename: req.file.filename});
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});