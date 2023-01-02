const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router
    .post('/signup', authController.signup)
    .post('/login', authController.login)
    .post('/forgotPassword', authController.forgotPassword)
    .patch('/resetPassword/:token', authController.resetPassword)

router.use(authController.protect)
    .patch('/updateMyPassword', authController.updateMyPassword)
    .patch('/updateMe', userController.uploadUserImage, userController.resizeImage, authController.updateMe);

router.get('/me', authController.me, userController.checkUserId, userController.getUser);

router.delete('/deleteMe', authController.protect, authController.deleteMe);

router.use(authController.restrictTo('admin'))
router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.checkUserId, userController.getUser)
    .patch(userController.checkUserId, userController.uploadUserImage, userController.resizeImage, userController.updateUser)
    .delete(userController.checkUserId, userController.deleteUser);

module.exports = router;