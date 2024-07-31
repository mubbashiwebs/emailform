import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const __dirname = path.resolve();
const app = express();
const upload = multer({ dest: 'uploads/' });

import mongoose from "mongoose"
const url = 'mongodb+srv://mubbashirwebs:2UJP7OWVJ7ctJaR7@eform.r6mconp.mongodb.net/?retryWrites=true&w=majority&appName=eForm'
mongoose.connect(url , { useNewUrlParser: true}).then(()=>{
  // console.log(12)
  console.log('successfully connected')
}).catch((err)=>{
  console.log(err + 11)
})

// var corsConfig = {
//     origin : "*",
//     credential:true,
//     methods : ["GET","POST","PUT", "DELETE"]
// };
// app.options("",cors(corsConfig))
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Define a Mongoose schema and model
const emailAuth = new mongoose.Schema({
    username: String,
    password: String,
    toEmail: String,
    category: String
  });
  
  const emailCollection = mongoose.model('emailAuth', emailAuth);
  
  // Route to handle form submission
  app.post('/addAuth', async (req, res) => {
    const { username, password,toEmail, category } = req.body;

    console.log(req.body)
    try {

            // Find the existing document by category
    let form = await emailCollection.findOne({ category });
    
    if (form) {
      // If the document exists, update it
      form.username = username;
      form.password = password;
      form.toEmail = toEmail;
      form.category = category;
      
      await form.save();
      res.json('Form updated successfully!');
    }
    else{


      // Create a new document
      const newForm = new emailCollection({
        username,
        password,
        toEmail,
        category
      });
      
      // Save the document to MongoDB
      await newForm.save();
      res.send('Form submitted successfully!');
    }
    } catch (error) {
      console.error('Error saving form:', error);
      res.status(500).send('Error saving form');
    }
  });
var contactEmailAuth        
var carrerEmailAuth 
// getAuthData()
//  async function getAuthData(){
//     var data = await emailCollection.findOne({ category : 'contact form' });
//     if(data){
//         contactEmailAuth = data
//         console.log(contactEmailAuth)
        
//     }
//     else{
//         contactEmailAuth = null
//     }

//     var carrerData = await emailCollection.findOne({ category : 'career form' });
//     // console.log(carrerData)
//     if(carrerData){
//         carrerEmailAuth = carrerData
//         console.log(carrerEmailAuth)
        
//     }
//     else{
//         carrerEmailAuth = null
      
//     }

// }


app.post('/submitCarrerForm', upload.single('cv'), async (req, res) => {

    const { name, email , phone ,url , menu , subselection , category ,gender} = req.body;
    console.log(req.body)
    // console.log('Form data received:');
    // console.log('Name:', req.body.name);
    // console.log('Email:', req.body.email);
    // console.log('Phone:', req.body.phone);
    // console.log('Portfolio URL:', req.body.url);
    // console.log('Selected Category:', req.body.menu);
    // console.log('Subselection:', req.body.subselection);
    // console.log('Category:', req.body.category);
    // console.log('Gender:', req.body.gender)
    const cvPath = req.file.path;
    const cvFilename = req.file.originalname;
    // console.log(cvPath)
    var carrerData = await emailCollection.findOne({ category : 'career form' });
    // console.log(carrerData)
    if(carrerData){
        carrerEmailAuth = carrerData
        // console.log(carrerEmailAuth)
        
    }
    else{
        carrerEmailAuth = null
      
    }
    if(carrerEmailAuth){
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: carrerEmailAuth.username ,
            pass: carrerEmailAuth.password
        }
    });

    const message = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPortfolio URL: ${url}\nSelected Category: ${menu}\nSubselection: ${subselection}\nCategory: ${category}\nGender: ${gender}`;

    
    const mailOptions = {
        from: email,
        to: carrerEmailAuth.toEmail,
        subject: 'New Career Form Submission',
        text: message,
        attachments: [
            {
                filename: cvFilename,
                path: cvPath
            }
        ]
    };
    
    
   
    try {
        await transporter.sendMail(mailOptions);
        res.send('Form submitted successfully!');
        fs.unlink(cvPath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    } catch (error) {
        res.status(500).send('Error sending email: ' + error.message);
    }
}
    else{
        return  res.send('auth is not found')
      }1
});


app.post('/submitContactForm', async (req, res) => {
    console.log('reach')
  
    const { name, email , phone , subject , service, message } = req.body;
    console.log(name)
    var data = await emailCollection.findOne({ category : 'contact form' });
    if(data){
        contactEmailAuth = data
        // console.log(contactEmailAuth)
        
    }
    else{
        contactEmailAuth = null
    }
    
    if(contactEmailAuth){

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
         user: contactEmailAuth.username,
            pass: contactEmailAuth.password
        }
    });


    const messageStructure = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nService: ${service}\nMessage: ${message}`;
    
    const mailOptions = {
        from: email,
        to: contactEmailAuth.toEmail,
        subject: 'New Career Form Submission',
        text: messageStructure,
      
    };

   
    try {
        await transporter.sendMail(mailOptions);
        res.send('Form submitted successfully!');
        
    } catch (error) {
        res.status(500).send('Error sending email: ' + error.message);
    }
}
else{
    return  res.send('auth is not found')

}
});

app.get('/test', async(req,res)=>{
    res.send('I am working')
})

let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
