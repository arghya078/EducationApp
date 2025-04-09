import React, { use } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'


const AddCourse = () => {
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  })

  const handleChapter = (action, chapterId) => {
    if(action === 'add'){
      const title = prompt('Enter Chapter Title')
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    }
     else if (action === 'remove') {
      setChapters(chapters.filter(chapter => chapter.chapterId !== chapterId))
    }
    else if (action === 'toggle') {
      setChapters(chapters.map((chapter) => 
        chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
      ))
    }
    }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setShowPopup(true)
      setCurrentChapterId(chapterId)
    } else if (action === 'remove') {
      setChapters(chapters.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          chapter.chapterContent.splice(lectureIndex, 1)
        }
        return chapter
      }))
    }
  }

  const addLecture = () => {
    setChapters(chapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
          lectureId: uniqid(),
        }
        chapter.chapterContent.push(newLecture)
      }
      return chapter
    }))
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

   useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        
      });
    }
  }, []);

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between p-4 md:p-8 md:pb-0 pt-8 pb-0'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-md text-gray-500'>
          <div className='flex flex-col gap-1'>
            <p>Course Title</p>
            <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)}  className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' placeholder='Course Title' required />
          </div>
          <div className='flex flex-col gap-1'>
            <p>Course Description</p>
            <div ref={editorRef}></div>
          </div>

          <div className='flex items-center justify-between flex-wrap'>
            <div className='flex flex-col gap-1'>
              <p>Course Price</p>
              <input type="number" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' placeholder='Course Price' required />
            </div>

            <div className='flex md:flex-row flex-col gap-3 items-center'>
              <p className='mt-3'>Course Thumbnail</p>
              <label htmlFor="thumbnailImage" className='flex items-center gap-3 cursor-pointer'>
                <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded mt-2' />
                <input type="file" id='thumbnailImage' onChange={(e) => setImage(e.target.files[0])} accept='image/*' className='hidden' />
                <img src={image ? URL.createObjectURL(image) : ''} alt="" className='max-h-10' />
              </label>
            </div>
          </div>
          <div>
            <p>Discount %</p>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} min={0} max={100} className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' placeholder='0' required />
          </div>

          {/* Chapters */}

          <div>
            {
              chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className='bg-white border rounded-lg mb-4'>
                   <div className='flex items-center justify-between p-4 border-b'>
                      <div className='flex items-center'>
                        <img src={assets.dropdown_icon} width={14} alt="" className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'}`} 
                        onClick={() => handleChapter('toggle', chapter.chapterId)}/>
                        <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                      </div>
                      <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                      <img src={assets.cross_icon} alt="" className='cursor-pointer'
                      onClick={() => handleChapter('remove', chapter.chapterId)}/>
                   </div>
                   {!chapter.collapsed && (
                    <div className='p-4'>
                    {
                      chapter.chapterContent.map((lecture, index) => (
                        <div key={index} className='flex items-center justify-between mb-2'>
                         <span>{index + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target='_blank' className='text-blue-500'>Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}</span>
                         <img src={assets.cross_icon} alt="" className='cursor-pointer'
                         onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} />
                          
                        </div>
                      ))
                    }
                    <div className='inline-flex bg-gray-100 p-2 rounded-lg cursor-pointer mt-2' onClick={() => handleLecture('add', chapter.chapterId)}>
                      + Add Lecture
                    </div>
                  </div>
                      )}
                </div>
              ))
            }
            <div className='flex items-center justify-center bg-blue-100 p-2 rounded-lg cursor-pointer' onClick={() => handleChapter('add')}>
              + Add Chapter
            </div>
            {showPopup && (
              <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
                <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80'>
                  <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>
                  <div className='mb-2'>
                    <p>Lecture Title</p>
                    <input type="text" value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({...lectureDetails, lectureTitle: e.target.value})} className='mt-1 block w-full border rounded py-1 px-2' placeholder='Lecture Title'  />
                    </div>


                    <div className='mb-2'>
                    <p>Duration (Minutes)</p>
                    <input type="number" value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({...lectureDetails, lectureDuration: e.target.value})} className='mt-1 block w-full border rounded py-1 px-2' placeholder='Lecture Duration'  />
                    </div>

                    <div className='mb-2'>
                    <p>Lecture Url</p>
                    <input type="text" value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({...lectureDetails, lectureUrl: e.target.value})} className='mt-1 block w-full border rounded py-1 px-2' placeholder='Lecture Url'  />
                    </div>

                    <div className='flex gap-2 my-4'>
                    <p>Preview Free</p>
                    <input type="checkbox" checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked})} className='mt-1 block w-full border rounded py-1 px-2'  />
                    </div>

                    <button onClick={addLecture} type='button' className='w-full bg-blue-400 text-white px-4 py-2 rounded'>Add</button>

                    <img src={assets.cross_icon} onClick={() => setShowPopup(false)} alt="" className='absolute top-4 right-4 w-4 cursor-pointer'/>
                </div>
              </div>
            )}
          </div>
          <button type='submit' className='bg-black text-white w-max py-2.5 px-8 rounded my-4'>Add Course</button>
        </form>
    </div>
  )
}

export default AddCourse