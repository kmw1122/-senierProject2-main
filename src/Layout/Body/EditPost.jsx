import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const EditPost = () => {
  const { idx } = useParams()
  const navigate = useNavigate()

  const [postContent, setPostContent] = useState({
    title: '',
    content: '',
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/get/${idx}`)
        const postData = response.data

        setPostContent({
          title: postData.title,
          content: postData.content,
        })
      } catch (error) {
        console.log('게시물을 불러오는 중 오류가 발생했습니다.', error)
      }
    }

    fetchPost()
  }, [idx])

  const updatePost = async () => {
    try {
      await axios.put(`http://localhost:8000/api/update/${idx}`, {
        title: postContent.title,
        content: postContent.content,
      })

      alert('게시물이 수정되었습니다!')
      navigate('/community') // 게시판 페이지로 이동
    } catch (error) {
      console.log('게시물 수정 중 오류가 발생했습니다.', error)
    }
  }

  const handleTitleChange = (e) => {
    setPostContent((prevContent) => ({
      ...prevContent,
      title: e.target.value,
    }))
  }

  const handleContentChange = (event, editor) => {
    const data = editor.getData()
    setPostContent((prevContent) => ({
      ...prevContent,
      content: data,
    }))
  }

  return (
    <div>
      <h2>게시물 수정</h2>
      <input
        type="text"
        placeholder="제목"
        value={postContent.title}
        onChange={handleTitleChange}
      />
      <CKEditor
        editor={ClassicEditor}
        data={postContent.content}
        onChange={handleContentChange}
      />
      <button onClick={updatePost}>게시물 수정</button>
    </div>
  )
}

export default EditPost
