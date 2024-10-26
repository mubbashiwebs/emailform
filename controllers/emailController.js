import mongoose from "mongoose";
import nodemailer from "nodemailer";
import fs from "fs";
import multer from "multer";

// Define the Mongoose schema and model
const emailAuthSchema = new mongoose.Schema({
    username: String,
    password: String,
    toEmail: String,
    category: String,
});

const EmailAuth = mongoose.model('emailAuth', emailAuthSchema);

// MongoDB connection URL
const url = 'mongodb+srv://mubbashirwebs:hjgh@cluster0.kliv5.mongodb.net/emails?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Controller functions
export const addAuth = async (req, res) => {
    const { username, password, toEmail, category } = req.body;

    try {
        let form = await EmailAuth.findOne({ category });
        
        if (form) {
            form.username = username;
            form.password = password;
            form.toEmail = toEmail;
            await form.save();
            return res.json('Form updated successfully!');
        }

        const newForm = new EmailAuth({ username, password, toEmail, category });
        await newForm.save();
        res.send('Form submitted successfully!');
    } catch (error) {
        console.error('Error saving form:', error);
        res.status(500).send('Error saving form');
    }
};

export const submitCareerForm = async (req, res) => {
    const { name, email, phone, url, menu, subselection, category, gender } = req.body;
    const cvPath = req.file.path;
    const cvFilename = req.file.originalname;

    try {
        const careerData = await EmailAuth.findOne({ category: 'career form' });

        if (!careerData) {
            return res.send('auth is not found');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: careerData.username,
                pass: careerData.password
            }
        });

        const message = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPortfolio URL: ${url}\nSelected Category: ${menu}\nSubselection: ${subselection}\nCategory: ${category}\nGender: ${gender}`;
        
        const mailOptions = {
            from: email,
            to: careerData.toEmail,
            subject: 'New Career Form Submission',
            text: message,
            attachments: [{ filename: cvFilename, path: cvPath }]
        };

        await transporter.sendMail(mailOptions);
        res.send('Form submitted successfully!');

        fs.unlink(cvPath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    } catch (error) {
        res.status(500).send('Error sending email: ' + error.message);
    }
};

export const submitContactForm = async (req, res) => {
    const { name, email, phone, subject, service, message } = req.body;

    try {
        const contactData = await EmailAuth.findOne({ category: 'contact form' });

        if (!contactData) {
            return res.send('auth is not found');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: contactData.username,
                pass: contactData.password
            }
        });

        const messageStructure = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nService: ${service}\nMessage: ${message}`;
        
        const mailOptions = {
            from: email,
            to: contactData.toEmail,
            subject: 'New Contact Form Submission',
            text: messageStructure,
        };

        await transporter.sendMail(mailOptions);
        res.send('Form submitted successfully!');
    } catch (error) {
        res.status(500).send('Error sending email: ' + error.message);
    }
};

export const test = async (req, res) => {
    const data = await EmailAuth.find({});

    res.json(data)

};
