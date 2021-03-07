import express from 'express';
import { readdirSync } from 'fs';
const morgan = require('morgan');
require('dotenv').config();
import cors from 'cors';
import mongoose from 'mongoose';
const app = express();

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`DB CONNECTED`))
  .catch(() => console.log(`DB CONNECTION ERROR`));

//middlewares

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
//route middleware
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
