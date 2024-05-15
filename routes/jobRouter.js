import express from 'express'
import { deleteJob, getAllJobs, getMyJobs, postJob, updateJob } from '../controllers/jobController.js'
import { isAuthorized } from '../middlewares/auth.js'
const router = express.Router()

router.get('/getall', getAllJobs)
router.post('/postJob', isAuthorized, postJob)
router.post('/getmyjobs', isAuthorized, getMyJobs)
router.put('/updatejob/:id', isAuthorized, updateJob)
router.delete('/deletejob', isAuthorized, deleteJob)

export default router