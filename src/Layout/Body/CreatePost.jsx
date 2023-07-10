import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const CreatePost = () => {
  const navigate = useNavigate()
  const [postContent, setPostContent] = useState({
    title: '',
    content: '',
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post('http://localhost:8000/api/insert', postContent)
      .then((response) => {
        console.log(response.data) // 작성 성공 시 서버로부터 받은 응답 출력
        alert('게시물이 작성되었습니다!') // 작성 성공 알림
        navigate('/community') // '/community' 경로로 이동
      })
      .catch((error) => {
        console.log('게시물 작성 중 오류가 발생했습니다.', error)
      })
  }

  return (
    <div>
      <h2>게시물 작성</h2>
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
      <button onClick={handleSubmit}>작성</button>
    </div>
  )
}

export default CreatePost
