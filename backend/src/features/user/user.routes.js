const router = require('express').Router();
const controller = require('./user.controller')
const authMiddleware = require('../../middleware/authMiddleware')
const adminOnly = require('../../middleware/adminOnly')

// to add email id to a existing user 
router.patch('/upgrade',authMiddleware, controller.addEmail);

// to get the data of the current user 
router.get('/me', authMiddleware, controller.getCurrentUser);

// to delete a user using user id 
router.patch('/delete',authMiddleware, controller.deleteUser)

// to promote a user
router.patch('/promote/:id', authMiddleware, adminOnly, controller.promote);

// to demote user
router.patch('/demote/:id', authMiddleware, adminOnly, controller.demote);

module.exports = router;

