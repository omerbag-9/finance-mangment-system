import express from 'express';
import {  isAuthorized, isAuthenticated } from '../../middleware/authentication.js';
import { approveBonus, createBonus, deleteBonus, getBonuses, rejectBonus, updateBonus } from './bonus.controller.js';
import { validateCreateBonus } from './bonus.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { isValid } from '../../middleware/validation.js';
import { userRoles } from '../../utils/constant/enums.js';

const bonusRouter = express.Router();


// add bonus
bonusRouter.post('/', 
    isAuthenticated(),
    isAuthorized([userRoles.MANAGER]),
  asyncHandler(createBonus)
);

// get bonuses
bonusRouter.get('/',isAuthenticated(), isAuthorized([userRoles.MANAGER , userRoles.FINANCE_STAFF]),asyncHandler(getBonuses));

// update bonus
bonusRouter.put('/:id',isAuthenticated(), isAuthorized([userRoles.MANAGER]), asyncHandler(updateBonus));

// delete bonus
bonusRouter.delete('/:id',isAuthenticated(), isAuthorized([userRoles.MANAGER]), asyncHandler(deleteBonus));

// approve bonus
bonusRouter.put('/approve/:id',isAuthenticated(), isAuthorized([userRoles.FINANCE_STAFF]), asyncHandler(approveBonus));

// reject bonus
bonusRouter.put('/reject/:id',isAuthenticated(), isAuthorized([userRoles.FINANCE_STAFF]), asyncHandler(rejectBonus));
export default bonusRouter;
