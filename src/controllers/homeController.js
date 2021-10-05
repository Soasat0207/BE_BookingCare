
import db from '../models/index';
import CRUDService from '../services/CRUDServices'
let getHomePage = async(req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs',{
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.error(error);
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
let getCRUD = async(req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send('post crud to server')
}
let displayGetCRUD = async(req, res) => {
    let data = await CRUDService.getAllUsers();
    return res.render('displayCRUD.ejs',{
        data: data,
    })
}
let getEditCRUD = async(req, res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDService.getUserInfoById(userId);      
        return res.render('editCRUD.ejs',{
            user:userData
        });
    }
    else{
        return res.send('users not found');
    }
}
let putCRUD = async(req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    
    return res.render('displayCRUD.ejs',{
        data: allUser,
    })

}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if(id){
        await CRUDService.deleteUserData(id);
        return res.send('delete the user succeed')
    }
    else{
        return res.send('user not found');
    }
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    displayGetCRUD:displayGetCRUD,
    getEditCRUD:getEditCRUD,
    putCRUD:putCRUD,
    deleteCRUD:deleteCRUD
}
