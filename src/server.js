import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDb from './config/connectDb';
import cors from 'cors'
require('dotenv').config();

let app = express();
const corsOptions ={
  origin:true, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
//config app
app.use(cors(corsOptions));// Use this after the variable declaration
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app);
initWebRoutes(app);
connectDb();
let port = process.env.PORT || 6969;
//Port === undefined => port = 6969

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
