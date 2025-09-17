import {Router} from 'express'

import authenticate from '../../../middlewares/authenticate.js'
import requestController from '../controllers/requestController.js'
const router  = Router()

router.route('/sendRequest').post(authenticate.verifyToken,requestController.sendRequest)



export default router