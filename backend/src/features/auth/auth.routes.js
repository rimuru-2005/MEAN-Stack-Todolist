const router = require('express').Router();
const controller = require('./auth.controller')
const adminOnly = require('../../middleware/adminOnly')
const authMiddleware = require('../../middleware/authMiddleware');
const { Router } = require('express');

// to create a guest user 
router.post('/guest', controller.createGuest);

// to create a user account
router.post("/signup", controller.createUserEmail);

// to log a user in 
router.post('/login', controller.login);

//  to log a user out 
router.post("/logout", controller.logout);

// to create a admin account
router.post(
  "/newadmin",
  authMiddleware,
  adminOnly,
  controller.createUserEmailAdmin,
);

module.exports = router
