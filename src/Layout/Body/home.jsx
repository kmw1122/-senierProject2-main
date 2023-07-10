import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Home() {
  const [viewContent1, setViewContent1] = useState([])
  const [viewContent2, setViewContent2] = useState([])
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  useEffect(() => {
    updateViewContent1()
    updateViewContent2()
  }, [])

  const updateViewContent1 = () => {
    setLoading1(true)
    axios
      .get('http://localhost:8000/api/get')
      .then((response) => {
        const sortedData = response.data.sort((a, b) => b.idx - a.idx)
        setViewContent1(sortedData)
        setLoading1(false)
      })
      .catch((error) => {
        console.log('데이터를 가져오는 중 오류가 발생했습니다.', error)
        setLoading1(false)
      })
  }

  const updateViewContent2 = () => {
    setLoading2(true)
    axios
      .get('http://localhost:8000/api/getLiked')
      .then((response) => {
        const sortedData = response.data.sort((a, b) => b.likes - a.likes)
        setViewContent2(sortedData)
        setLoading2(false)
      })
      .catch((error) => {
        console.log('데이터를 가져오는 중 오류가 발생했습니다.', error)
        setLoading2(false)
      })
  }

  const removeTags = (str) => {
    if (str === null || str === '') return ''
    else str = str.toString()

    return str.replace(/(<([^>]+)>)/gi, '')
  }

  const handleLike = (idx) => {
    axios
      .put(`http://localhost:8000/api/like/${idx}`)
      .then((response) => {
        // 좋아요 수 업데이트 후 최신 데이터로 게시판 새로고침
        updateViewContent2()
      })
      .catch((error) => {
        console.log('좋아요 요청 중 오류가 발생했습니다.', error)
      })
  }

  return (
    <div className="App">
      <h1>사진 넣을 자리</h1>
      <hr />
      <h2>최신순 게시판</h2>
      <div className="community-container">
        {loading1 ? (
          <p>Loading...</p>
        ) : (
          viewContent1.map((element) => (
            <div key={element.idx} className="title">
              <h3>{element.title}</h3>
              <div>{removeTags(element.content)}</div>
              <div className="button-container"></div>
            </div>
          ))
        )}
      </div>
      <hr />

      <h2>좋아요 게시판</h2>
      <div className="community-container">
        {loading2 ? (
          <p>Loading...</p>
        ) : (
          viewContent2.map((element) => (
            <div key={element.idx} className="title">
              <h3>{element.title}</h3>
              <div>{removeTags(element.content)}</div>
              <div className="button-container">
                <button onClick={() => handleLike(element.idx)}>좋아요</button>
                <span>{element.likes}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <hr />
    </div>
  )
}

export default Home
