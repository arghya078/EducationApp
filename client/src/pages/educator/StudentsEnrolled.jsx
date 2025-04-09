import React from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import Loading from '../../components/students/Loading'

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled)
  }

  useEffect(() => {
    fetchEnrolledStudents()
  }, [])
  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-between p-4 md:p-8 md:pb-0 pt-8 pb-0'>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='md:table-auto table-fixed w-full overflow-hidden pb-4'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                <th className='px-4 py-3 font-semibold text-center'>Student Name</th>
                <th className='px-4 py-3 font-semibold text-center'>Course Title</th>
                <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>

              </tr>
            </thead>
            <tbody>
              {
                enrolledStudents.map((item, index) => (
                  <tr className='border-b border-gray-500/20' key={index}>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                    <td className='md:px-4 px-2 py-3 flex items-center text-center space-x-3'>
                      <img src={item.student.imageUrl} alt="" className='w-10 h-10 rounded-full' />
                      <span className='truncate'>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
    </div>
  ) : (
      <Loading />
  )
}

export default StudentsEnrolled