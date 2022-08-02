import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import cors from 'cors'

dotenv.config();

mongoose
.connect(process.env.MONGODB_LOCAL,
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
  }
  )
.then(()=>{
  console.log('DATABASE CONNECTED'.blue.bold.underline)
})
.catch((err) => {
  console.log(err.message);
});

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// test
app.use('/api/seed', seedRouter);
app.use('/api/products',productRouter);
app.use('/api/users', userRouter);


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`.blue.bold);
});