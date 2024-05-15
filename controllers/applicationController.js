import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import pkg from 'cloudinary';
const { cloudinary } = pkg;

export const postApplication = catchAsyncError(
    async (req, res, next) => {

        if (role === "Employer") {
            return next(
                new ErrorHandler("Employer not allowed to access this resource.", 400)
            )
        }

        if (!req.files || isObjectIdOrHexString.keys(req.files).length == 0) {
            return next(new ErrorHandler('resume file required'))
        }

        const { resume } = req.files
        const allowedFormats = ['image/png', 'image/jpg', 'img/webp']

        if (!allowedFormats.includes(resume.mimetype)) {
            return next(new ErrorHandler('inlvalid file type , use png/jpg/webp'))
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath)

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error('Cloudinary Error:', cloudinaryResponse.error || 'unknown error')

            return next(new ErrorHandler('failed to upload resume', 500))
        }

        const { name, email, coverLetter, phone, address, jobId } = req.body

        const applicantID = {
            user: req.user._id,
            role: 'Job Seeker'
        }

        if (!jobId) {
            return next(new ErrorHandler('job not found', 404))
        }

        const jobDetails = await jobId.findById(jobId)
        if (!jobDetails) {
            return next(new ErrorHandler('job not found', 404))
        }

        const employerID = {
            user: jobDetails.postedBy,
            role: 'Employer'
        }

        if (
            !name ||
            !email ||
            !coverLetter ||
            !phone ||
            !address ||
            !applicantID ||
            !employerID ||
            !resume
        ) {
            return next(new ErrorHandler("Please fill all fields.", 400))
        }

        const application = await Application.create({
            name,
            email,
            coverLetter,
            phone,
            address,
            applicantID,
            employerID,
            resume: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        })

        return res.status(200).json({
            success: true,
            message: 'application submitted successfully'
        })
    })

export const employerGetAllApplications = catchAsyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "Job Seeker") {
            return next(
                new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
            );
        }
        const { _id } = req.user;
        const applications = await Application.find({ "employerID.user": _id });
        res.status(200).json({
            success: true,
            applications,
        });
    }
);

export const jobSeekerGetAllApplications = catchAsyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "Employer") {
            return next(
                new ErrorHandler("Employer not allowed to access this resource.", 400)
            );
        }
        const { _id } = req.user;
        const applications = await Application.find({ "applicantID.user": _id });
        res.status(200).json({
            success: true,
            applications,
        });
    }
);

export const jobSeekerDeleteApplication = catchAsyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "Employer") {
            return next(
                new ErrorHandler("Employer not allowed to access this resource.", 400)
            );
        }
        const { id } = req.params;
        const application = await Application.findById(id);
        if (!application) {
            return next(new ErrorHandler("Application not found!", 404));
        }
        await application.deleteOne();
        res.status(200).json({
            success: true,
            message: "Application Deleted!",
        });
    }
);