const mongoose = require('mongoose');
require('dotenv').config();
const { user } = require('./seed-data');
const { User } = require("../models");
const {
    generateAuthTokens,
    generateSaltAndHashForPassword
} = require("../services/token.service");
/*
to add admin data in DB 
npm run seed 
*/

// LoadingBar.start();
async function createMongooseConnection() {
    let db = mongoose.connect(process.env.dbUrl + process.env.dbName, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, socketTimeoutMS: 300000 })
    return db
}

async function createAdminEntries() {

    const dbConnection = await createMongooseConnection();
    try {
        let data = {
            firstName: "Admin",
            lastName: "Upstarpp",
            email: "saifadmin@gmail.com",
            password: "admin123",
            phoneNumber: "9878765643",
            image: "https://wallet-system.s3.us-east-2.amazonaws.com/male.jpg",
            gender: "male",
            dob: "08 / 09 / 1995",
            roleType: "1",
            name: "Admin"
        }
        const user = await User.create(data);
        const token = await generateAuthTokens(user.id);
        user.userJwt = token.token;
        user.isOnline = 1;
        await user.save();
        return user
    } catch (e) {
        console.error('error', e);
    }
    finally {
        // await dbConnection.close();
    }
}
// async function createAdmin(data) {
//     // console.log("admin data password=>", data.password)
//     let bcryptPassword = await generateSaltAndHashForPassword(
//         data.password
//     );
//     let adminData = {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         password: bcryptPassword,
//         phoneNumber: data.phoneNumber,
//         image: data.image,
//         gender: data.gender, 
//         dob: data.dob,
//         roleType: data.roleType 
//     }
//     const user = User.create(adminData);
//     return user
// }


createAdminEntries();
// createAdmin();


setTimeout((function () {
    console.log('\n Seeding Done!');
    process.exit();
}), 5000);
