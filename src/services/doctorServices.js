import db from '../models/index';
require('dotenv').config();
import _ from 'lodash'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE; 
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
            if(!data.doctorId || !data.contentHTML || !data.contentMarkdown|| !data.description || !data.descriptionHTML || !data.action){
                resolve({
                    errCode:1,
                    errMessage:'Missiong parameter'
                })
            } 
            else{
                if(data.action ==="CREATE"){
                    await db.Markdown.create({
                        contentHTML:data.contentHTML,
                        contentMarkdown:data.contentMarkdown,
                        descriptionHTML:data.descriptionHTML,
                        description:data.description,
                        doctorId:data.doctorId,
                    })
                }
                else if(data.action ==="EDIT"){
                    let doctorMarkDown = await db.Markdown.findOne({
                        where:{doctorId: data.doctorId},
                        raw:false,
                    })
                    if(doctorMarkDown){
                        doctorMarkDown.contentHTML= data.contentHTML;
                        doctorMarkDown.contentMarkdown= data.contentMarkdown;
                        doctorMarkDown.descriptionHTML= data.descriptionHTML;
                        doctorMarkDown.description= data.description;
                        doctorMarkDown.updateAt = new Date();
                        await doctorMarkDown.save();
                    }
                } 
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
let bulkCreateSchedule = (data) => {
    return new Promise(async(resolve, reject) =>{
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
                })
            }
            else{
                
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item =>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                let existing = await db.Schedules.findAll(
                    { 
                        where: { doctorId: data.doctorId,date: data.date,},
                        attributes:['timeType','date','doctorId','maxNumber'],
                        raw: true
                    });
                if(existing && existing.length > 0){
                    existing = existing.map(item =>{
                        item.date = new Date(item.date).getTime();
                        return item;
                    })
                }
                let toCreate = _.differenceWith(schedule, existing,(a,b)=>{
                    return a.timeType === b.timeType && a.date === b.date;
                });
                if(toCreate && toCreate.length > 0){
                    await db.Schedules.bulkCreate(toCreate); 
                }
                resolve({
                    errCode:0,
                    errMessage:'success'
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
    bulkCreateSchedule:bulkCreateSchedule,
}