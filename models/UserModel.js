import { Sequelize } from "sequelize";
import db from "../config/Database.js";

//1.Membuat tabel user
const User = db.define(
    "users", //Nama Tabel Database
    {
        name : Sequelize.STRING,
        email : {
            type : Sequelize.STRING, unique : true
        },
        password : Sequelize.STRING,
        role : {
            type : Sequelize.ENUM('admin', 'petugas', 'pengawas'),
            defaultValue : 'petugas',
        },
    },
    {
        freezeTableName : true,
        timestamps : true,
    }
);
db.sync().then(() => console.log("Database synced"));
export default User;