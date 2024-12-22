import {Bonus} from '../../../db/models/bonus.model.js';
import { ApiFeatures } from '../../utils/ApiFeature.js';
import { AppError } from '../../utils/appError.js';
import { messages } from '../../utils/constant/messages.js';

export const createBonus = async (req, res, next) => {
    // Get current date information
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
    
    // Check if current day is between 22-30
    if (currentDay < 22 || currentDay > 30) {
        return next(new AppError('Bonus can only be added between days 22-30 of the month', 400));
    }

    const { title, amount, reason, recipient } = req.body;

    // Get first and last day of current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

    try {
        // Check if user already has a bonus this month - using lean() for better performance
        const existingBonus = await Bonus.findOne({
            recipient: recipient,
            createdAt: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth
            }
        }).lean();

        if (existingBonus) {
            return next(new AppError(`User already received a bonus for ${monthName}`, 400));
        }
        
        const bonus = new Bonus({
            title,
            amount,
            reason,
            recipient,
            createdBy: req.authUser._id,
            month: monthName
        });

        const createdBonus = await bonus.save();
        
        if (!createdBonus) {
            return next(new AppError(messages.BONUS.FAIL, 500));
        }

        return res.status(201).json({
            message: `${messages.BONUS.CREATED} in ${monthName}`,
            success: true,
            data: {
                ...createdBonus.toObject(),
                addedInMonth: monthName
            }
        });

    } catch (error) {
        return next(new AppError('Error while processing bonus creation', 500));
    }
}



export const getBonuses = async (req, res, next) => {
    try {
        const features = new ApiFeatures(Bonus.find(), req.query)
            .filter()
            .sort()
            .paginate();

        const bonuses = await features.query
            .populate('recipient', 'name email')
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email');

        res.status(200).json({
            status: 'success',
            results: bonuses.length,
            data: bonuses
        });
    } catch (error) {
        next(error);
    }
};

export const updateBonus = async (req, res, next) => {
    const { title, amount, reason } = req.body
    const { id } = req.params

    const updatedBonus = await Bonus.findByIdAndUpdate(id, {
        title,
        amount,
        reason
    }, { new: true })

    if (!updatedBonus) {
        return next(new AppError(messages.BONUS.NOT_FOUND, 404))
    }

    return res.status(200).json({
        message: messages.BONUS.UPDATED,
        success: true,
        data: updatedBonus  
    })
    }

export const deleteBonus = async (req, res, next) => {
    const { id } = req.params

    const deletedBonus = await Bonus.findByIdAndDelete(id)

    if (!deletedBonus) {
        return next(new AppError(messages.BONUS.NOT_FOUND, 404))
    }

    return res.status(200).json({
        message: messages.BONUS.DELETED,
        success: true 
    })
    }

export const approveBonus = async (req, res, next) => {
    const { id } = req.params

    const approvedBonus = await Bonus.findByIdAndUpdate(id, {
        status: 'APPROVED',
        approvedBy: req.authUser._id
    }, { new: true })

    if (!approvedBonus) {
        return next(new AppError(messages.BONUS.NOT_FOUND, 404))
    }
    // delete rejectedBy field
    approvedBonus.rejectedBy = undefined
    await approvedBonus.save()
    return res.status(200).json({
        message: messages.BONUS.APPROVED,
        success: true,
        data: approvedBonus
    })
}

export const rejectBonus = async (req, res, next) => {
    const { id } = req.params

    const rejectedBonus = await Bonus.findByIdAndUpdate(id, {
        status: 'REJECTED',
        rejectedBy: req.authUser._id
    }, { new: true })

    if (!rejectedBonus) {
        return next(new AppError(messages.BONUS.NOT_FOUND, 404))
    }

    // delete approvedBy field
    rejectedBonus.approvedBy = undefined
    await rejectedBonus.save()

    return res.status(200).json({
        message: messages.BONUS.REJECTED,
        success: true,
        data: rejectedBonus
    })
    }