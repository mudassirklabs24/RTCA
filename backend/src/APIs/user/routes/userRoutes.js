import {Router} from 'express'
import userController from '../controllers/userController.js'
import authenticate from '../../../middlewares/authenticate.js'
const router  = Router()

router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/verify-otp').post(userController.verifyOtp)
router.route('/logout').delete(authenticate.verifyToken, userController.logout)

router.route('/allUsers').get(authenticate.verifyToken,userController.getAllUsers)


export default router