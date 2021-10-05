import bcrypt from 'bcryptjs';
import db from '../models/index'
const salt = bcrypt.genSaltSync(10);

let createNewUser = async(data) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email:data.email,
                password:hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address:data.address,
                gender:data.gender === '1' ? true : false,
                roleId: data.roleId,
                phonenumber: data.phonenumber,
            })
            resolve('done create a new user succeed !')
        } catch (error) {
            reject(error);
            console.log(error);
        }
    })
    
}
let hashUserPassword = (password) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
            console.log(error);
        }
    })
}
let getAllUsers = ()=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}
let getUserInfoById = (userId) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let user = await db.User.findOne({
                where:{id:userId},
                raw: true,
            })
            if(user){
                resolve(user);
            }
            else{
                resolve({});

            }
        } catch (error) {
            reject(error);
        }
    })
}
let updateUserData = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user = await db.User.findOne({
                where:{id:data.id},

            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                await user.save();
                let allUser = await db.User.findAll();
                resolve(allUser);
            }
            else{
                resolve();
            }
           
        } catch (error) {
            reject(error);
            
        }
    })
}
let deleteUserData = (id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            let user = await db.User.findOne({
                where:{id:id},
            })
            if(user){
                await user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}
module.exports ={
    createNewUser: createNewUser,
    getAllUsers:getAllUsers,
    getUserInfoById:getUserInfoById,
    updateUserData:updateUserData,
    deleteUserData:deleteUserData
}