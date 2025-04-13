import {clerkClient,} from "@clerk/express"
import {v2 as cloudinary} from 'cloudinary';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        });

        res.json({
            success: true,
            message: 'You cab publish course now',
        });
        
    } catch (error) {
        res.json({
            success: false,
            message: 'Something went wrong',
        });
    }
}

// Add new course

export const addCourse = async (req, res) => {
    try {
        const {courseData} = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if(!imageFile) {
            return res.json({
                success: false,
                message: 'Thumbnail not found',
            });

            
        }
    
        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save();
        res.json({
            success: true,
            message: 'Course added successfully',
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: 'Something went wrong',
        });
    }
}

// Get Educator Courses

export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({educator})
        res.json({
            success: true,
            courses,
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Something went wrong',
        });
    }
}

// Get Educator Dashboard Data

export const getEducatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // calculate total earnings
        const purchases = await Purchase.find({courseId: {$in: courseIds}, status: 'completed'});
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // collect unique enrolled students ids with their course titles

        const enrolledStudentsData = [];
        for (const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents},
                courseTitle: course.title,
            },'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }
        res.json({
            success: true,
            dashboardData: {
                totalCourses,
                totalEarnings,
                enrolledStudentsData,
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Something went wrong',
        });
    }
}

// Get Enrolled Students Data with purchase list

export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({courseId: {$in: courseIds}, status: 'completed'}).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => {
            return {
                student: purchase.userId,
                courseTitle: purchase.courseId.courseTitle,
                purchaseDate: purchase.createdAt,
            };
        });
        res.json({
            success: true,
            enrolledStudents,
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Something went wrong',
        });
    }
}