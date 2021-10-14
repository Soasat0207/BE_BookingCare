import db from '../models/index'
let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                order:[["createdAt","DESC"]],
                attributes:{
                    exclude:['password']
                },
                include:[
                    {model:db.Allcode,as:'positionData',attributes:['valueEn','valueVi']},
                    {model:db.Allcode,as:'genderData',attributes:['valueEn','valueVi']},
                ],
                raw:true,
                nest:true,
            })
            resolve({
                errCode:0,
                data:users,
            })
        } catch (error) {
            reject(error);
        }
    })
}
let getAllDoctors = () =>{
    return new Promise(async(resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where:{roleId:'R2'},
                attributes:{
                    exclude:['password']
                },
            })
            resolve({
                errCode:0,
                data:doctors,
            })
        } catch (error) {
            reject(error);
        }
    })
}
let saveDetailsInfoDoctor =(data)=>{
    return new Promise( async (resolve, reject) => {
        try {
            if(!data.doctorId || !data.contentHTML || !data.contentMarkdown){
                resolve({
                    errCode:1,
                    errMessage:'Missiong parameter'
                })
            } 
            else{
                await db.Markdown.create({
                    contentHTML:data.contentHTML,
                    contentMarkdown:data.contentMarkdown,
                    description:data.description,
                    doctorId:data.doctorId,
                })
                resolve({
                    errCode:0,
                    errMessage:'Save Info Doctor Success'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode:1,
                    errMessage:'Missiong parameter'
                })
            }
            else{
                let data = await db.User.findOne({
                    where: {id:id},
                    include:[
                        {
                            model:db.Markdown,
                            // attributes:['description','contentHTML','contentMarkdown'],
                        },
                        {model:db.Allcode,as:'positionData',attributes:['valueEn','valueVi']},
                    ],
                    attributes:{
                        exclude:['password']
                    },
                    raw: false,
                    nest:true,
                })
                if(data && data.image){
                    data.image = new Buffer(data.image,'base64').toString('binary');
                }
                if(!data){
                    data={}
                }
                resolve({
                    errCode:0,
                    data:data,
                })
                
            }
        } catch (error) {
            reject(error); 
        }
    })
}
module.exports = {
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    saveDetailsInfoDoctor:saveDetailsInfoDoctor,
    getDetailDoctorById:getDetailDoctorById,
}