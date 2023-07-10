import React, { useEffect, useState } from 'react'
import './community.css'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Community() {
  const [viewContent, setViewContent] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    updateViewContent()
  }, [])

  const deleteContent = (idx) => {
    axios
      .delete(`http://localhost:8000/api/delete/${idx}`)
      .then(() => {
        alert('삭제 완료!')
        updateViewContent()
      })
      .catch((error) => {
        console.log('삭제 중 오류가 발생했습니다.', error)
      })
  }

  const updateViewContent = () => {
    setLoading(true)
    axios
      .get('http://localhost:8000/api/get')
      .then((response) => {
        setViewContent(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log('데이터를 가져오는 중 오류가 발생했습니다.', error)
        setLoading(false)
      })
  }

  return (
    <div className="App">
      <h1>식물 게시판</h1>
      <div className="community-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          viewContent.map((element) => (
            <div key={element.idx} className="title">
              <h2>{element.title}</h2>
              <div>{element.content}</div>
              <div className="button-container">
                <button
                  className="button"
                  onClick={() => deleteContent(element.idx)}
                >
                  삭제
                </button>
                <Link to={`/editpost/${element.idx}`} className="button">
                  수정
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      <Link to="/createpost" className="createpost-button">
        게시글 작성
      </Link>
    </div>
  )
}

export default Community
