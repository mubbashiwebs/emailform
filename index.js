
import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/emailRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the email routes
app.use('/api', emailRoutes);
app.get('/',(req,res)=>{
res.send('running')
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
