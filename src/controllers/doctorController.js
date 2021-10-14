import doctorServices from '../services/doctorServices'
let getTopDoctorHomeCode = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorServices.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...'
        })
    }
}
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorServices.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (error) {
        console.error(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ...'
        })
    }
}
let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorServices.saveDetailsInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ...'
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorServices.getDetailDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.error(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ...'
        })
    }
}
module.exports = {
    getTopDoctorHomeCode: getTopDoctorHomeCode,
    getAllDoctors: getAllDoctors,
    postInfoDoctor:postInfoDoctor,
    getDetailDoctorById:getDetailDoctorById
}