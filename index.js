const express = require("express");
//const conectarDB = require('./config/db');
//const cors = require("cors");

const app = express();

const port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server on port ${port}`);
});
