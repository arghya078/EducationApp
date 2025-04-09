import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import {Line} from 'rc-progress'
import Footer from '../../components/students/Footer'

const MyEnrollments = () => {
  const {enrolledCourses, calculateCourseDuration, navigate} = useContext(AppContext)
  const [progressArray, setProgressArray] = useState([
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 4, totalLectures: 10},
  ])
  return (
    <>
    <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {enrolledCourses.map((course, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                  <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28'/>
                  <div className='flex-1'>
                  <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                  <Line percent={(progressArray[index].lectureCompleted / progressArray[index].totalLectures) * 100} strokeWidth='2' strokeColor='#2563EB' className='max-sm:hidden'/>
                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                 {progressArray[index] && `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`} <span>Lectures</span> 
                </td>
                <td className='px-4 py-3 max-sm:text-right'>
                  <button onClick={() => navigate('/player/' + course._id)} className='px-4 py-1 bg-blue-600 text-white rounded-md'>
                    {progressArray[index] && progressArray[index].lectureCompleted === progressArray[index].totalLectures ? 'Completed' : 'Resume'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    <Footer />
    </>
  )
}

export default MyEnrollments