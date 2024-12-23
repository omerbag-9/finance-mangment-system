import { Bonus } from '../../../db/models/bonus.model.js';
import { ApiFeatures } from '../../utils/ApiFeature.js';
import { AppError } from '../../utils/appError.js';
import { messages } from '../../utils/constant/messages.js';
import { sendEmail } from '../../utils/email.js';

export const createBonus = async (req, res, next) => {
    // Get current date information
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

    // Check if current day is between 22-30
    if (currentDay < 22 || currentDay > 30) {
        return next(new AppError('Bonus can only be added between days 22-30 of the month', 400));
    }

    const { title, amount, reason } = req.body;
    const recipient = req.params.id; // Get the recipient (user ID) from the URL parameter

    // Ensure recipient (user ID) is provided
    if (!recipient) {
        return next(new AppError('Recipient (user ID) is required', 400));
    }

    // Get first and last day of current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

    try {
        // Check if user already has a bonus this month
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
            recipient, // Set recipient to the user ID from the URL param
            createdBy: req.authUser._id, // The ID of the user creating the bonus
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
    try {
        const { id } = req.params;

        const approvedBonus = await Bonus.findByIdAndUpdate(id, {
            status: 'APPROVED',
            approvedBy: req.authUser._id
        }, { new: true })
            .populate('createdBy')  // Populate manager details        
        if (!approvedBonus) {
            return next(new AppError(messages.BONUS.NOT_FOUND, 404));
        }

        approvedBonus.rejectedBy = undefined;
        await approvedBonus.save();

        // Send email to manager
        await sendEmail({
            to: approvedBonus.createdBy.email, 
            subject: `Bonus Approved for user `,
            html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Bonus Request Approved</h2>
                    </div>
                `
        });

        return res.status(200).json({
            message: messages.BONUS.APPROVED,
            success: true,
            data: approvedBonus
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const rejectBonus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const rejectedBonus = await Bonus.findByIdAndUpdate(id, {
            status: 'REJECTED',
            rejectedBy: req.authUser._id
        }, { new: true })
            .populate('createdBy')  // Populate manager details

        if (!rejectedBonus) {
            return next(new AppError(messages.BONUS.NOT_FOUND, 404));
        }

        rejectedBonus.approvedBy = undefined;
        await rejectedBonus.save();

        // Send email to manager
        await sendEmail({
            to: rejectedBonus.createdBy.email, 
            subject: `Bonus Approved for user `,
            html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Bonus Request rejected</h2>
                    </div>
                `
        });
        return res.status(200).json({
            message: messages.BONUS.REJECTED,
            success: true,
            data: rejectedBonus
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


export const getSpecificBonus = async (req, res, next) => {
    const { id } = req.params

    const specificBonus = await Bonus.findById(id)
        .populate('recipient', 'name email')
        .populate('createdBy', 'name email')
        .populate('approvedBy', 'name email')

    if (!specificBonus) {
        return next(new AppError(messages.BONUS.NOT_FOUND, 404))
    }

    return res.status(200).json({
        message: messages.BONUS.FOUND,
        success: true,
        data: specificBonus
    })
}