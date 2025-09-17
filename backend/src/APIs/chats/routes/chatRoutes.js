import {Router} from 'express'
import chatController from '../controllers/chatController.js'
import authenticate from '../../../middlewares/authenticate.js'
const router  = Router()

router.route('/:otherUserId').post(authenticate.verifyToken,chatController.createChat)
// router.route('/login').post()
// router.route('/verify-otp').post(userController.verifyOtp)
// router.route('/logout').delete()

// router.route('/allUsers').get()


export default router