const Court = require('../models/court.model');

const createCourt = async (courtData) => {
    try {
        const court = new Court(courtData);
        await court.save();
        return court;
    } catch (error) {
        throw new Error('Failed to create court');
    }
};

const getAllCourts = async () => {
    try {
        const courts = await Court.find();
        return courts;
    } catch (error) {
        throw new Error('Failed to get courts');
    }
};

const getCourtById = async (id) => {
    try {
        const court = await Court.findById(id);
        return court;
    } catch (error) {
        throw new Error('Failed to get court by id');
    }
};

const updateCourt = async (id, courtData) => {
    try {
        const court = await Court.findByIdAndUpdate(id, courtData, { new: true });
        return court;
    } catch (error) {
        throw new Error('Failed to update court');
    }
};

const deleteCourt = async (id) => {
    try {
        await Court.findByIdAndDelete(id);
    } catch (error) {
        throw new Error('Failed to delete court');
    }
};

module.exports = {
    createCourt,
    getAllCourts,
    getCourtById,
    updateCourt,
    deleteCourt,
};



