import express from 'express'
import { employerGetAllApplications, jobSeekerDeleteApplication, jobSeekerGetAllApplications, postApplication } from '../controllers/applicationController.js'
import { isAuthorized } from '../middlewares/auth.js'
const router = express.Router()

router.post('/employer/post', isAuthorized, postApplication)
router.get('/employer/getall', isAuthorized, employerGetAllApplications)
router.get('/jobseeker/getall', isAuthorized, jobSeekerGetAllApplications)
router.delete('/delete/:id', isAuthorized, jobSeekerDeleteApplication)

export default router