import { createContext, use } from "react";
import { dummyCourses } from "../assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()

    const {getToken} = useAuth()
    const {user} = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])

    // Fetch all courses

    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }

    //Function to calculate average rating

    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let total = 0
        course.courseRatings.forEach(rating => {
            total += rating.rating
        })
        return total / course.courseRatings.length
    }

    // function to calculate course chapter time

    const calculateChapterTime = (chapter) => {
        let time =0
        chapter.chapterContent.map((lecture) => {
            time += lecture.lectureDuration
        })
        return humanizeDuration(time*60*1000, {units: ['h','m']})
    }

    // function to calculate total course time

    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture)=>{
            time += lecture.lectureDuration
        }))
        return humanizeDuration(time*60*1000, {units: ['h','m']})
    }

    // function to calculate total no. of lectures

    const calculateNoOfLectures = (course) => {
        let lectures = 0
        course.courseContent.forEach((chapter) => {
            if(Array.isArray(chapter.chapterContent)){
                lectures += chapter.chapterContent.length
            }
        })
        return lectures
    }

    //fetch User enrolled courses

    const fetchEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses)
    }


    useEffect(() => {
        fetchAllCourses()
        fetchEnrolledCourses()
    }, [])

    const logToken = async () => {
        const token = await getToken()
        console.log(token)
    }

    useEffect(() => {
        if(user){
            logToken()
        }
    })

    const value = {
        currency,allCourses,navigate,calculateRating,isEducator,setIsEducator,calculateChapterTime,calculateCourseDuration,calculateNoOfLectures,enrolledCourses,fetchEnrolledCourses

    }
    return (
        <AppContext.Provider value={value}>
        {props.children}
        </AppContext.Provider>
    );
}