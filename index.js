const express = require('express');
const {DataTypes, Sequelize} = require('sequelize');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');




const sequelize = new Sequelize(
    process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
        host:"localhost",
        dialect:"mysql"
    }
);
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//load models 
const UserModel = require('./models/user.model.js')(sequelize,DataTypes);
const db = {User : UserModel};
global.models =db;

app.use(morgan("tiny"));

const authRoutes = require('./routes/user.routes.js');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/task.routes.js')
app.use('/api',taskRoutes);


(
    async()=>{
        try {
            await sequelize.sync({ alter: true });
            console.log("Databse Sync");
            app.listen(port, ()=> console.log(`Server is running on PORT:http://localhost:${port}`))
        } catch (error) {
            console.error("❌ Unable to start app:", error);
        }
    }
)();

