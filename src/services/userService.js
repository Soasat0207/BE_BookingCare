import bcrypt from 'bcryptjs';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);
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
let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist) {
                // user already exists
                let user = await db.User.findOne({
                    where: {email:email},
                    attributes: ['email', 'roleId','password','firstName','lastName'],
                    raw: true,
                })
                if(user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errCode = 0 ;
                        userData.errMessage = 'ok';
                        delete user.password;
                        userData.user  = user;
                    }
                    else {
                        userData.errCode = 3 ;
                        userData.errMessage = 'Wrong password';
                    }
                }
                else{
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
            }
            else{
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Please try other email`
            }
            resolve(userData)
        } catch (error) {
            reject(error);
        }
    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user= await db.User.findOne({
                where: {email:userEmail}
            })
            if(user){
                resolve(true);
            }
            else{
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users= '';
            if(userId == "ALL"){
                 users = await db.User.findAll({
                    attributes:{
                        exclude:['password']
                    }
                 });
            }
            if(userId && userId !== "ALL"){
                users = await db.User.findOne({
                    where: { id: userId},
                    attributes:{
                        exclude:['password']
                    }
                });
            }
            resolve(users)
        } catch (error) {
            reject(error);
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            //check email is exist 
            let check = await checkUserEmail(data.email);
            if(check === true ){
                resolve({
                    errCode:1,
                    errMessage:'Your email is already in used , Plz try another email'
                })
            }
            else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email:data.email,
                    password:hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address:data.address,
                    gender:data.gender ,
                    roleId: data.roleId,
                    phonenumber: data.phoneNumber,
                    positionId:data.positionId,
                    image:data.avatar
                })
                resolve({
                    errCode:0,
                    message:'ok'
                })
            }
            
        } catch (error) {
            reject(error);
        }
    })
}
let deleteUser = (id)=>{
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
            })
            if(!user) {
                resolve({
                    errCode:2,
                    errMessage:`The user isn't exist `
                })
            }  
            await db.User.destroy({
                where: { id: id },
            });
            resolve({
                errCode:0,
                message:'The user is delete'
            })
        } catch (error) {
            reject(error);
        }
    })
}
let updateUserData = (data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({
                    errCode:2,
                    errMessage:`Missing required parameter`
                })
            }
            let user = await db.User.findOne({
                where:{id:data.id},
                raw: false,
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender=data.gender;
                user.phonenumber = data.phoneNumber;
                if(data.avatar){
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode:0,
                    message:'Update user success'
                });
            }
            else{
                resolve({
                    errCode:1,
                    errMessage:'User not found'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllCodeService  = (type)=>{
    return new Promise( async (resolve, reject) => {
        try {
            if(!type){
                resolve({
                    errCode:1,
                    errMessage:`Missing required parameter`,
                });
            }
            else{
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: {type: type}
                });
                res.errCode = 0 ;
                res.data = allCode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports ={
    handleUserLogin:handleUserLogin,
    getAllUsers:getAllUsers,
    createNewUser:createNewUser,
    deleteUser:deleteUser,
    updateUserData:updateUserData,
    getAllCodeService:getAllCodeService,
};