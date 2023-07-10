import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactHtmlParser from 'html-react-parser'
import { useNavigate } from 'react-router-dom'
import './Mypage.css'

const Mypage = () => {
  const defaultImage =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  const [imageSrc, setImageSrc] = useState(defaultImage)
  const [userData, setUserData] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [boardData, setBoardData] = useState([])
  const navigate = useNavigate()

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/userdata', {
        withCredentials: true,
      })
      setUserData(response.data)
    } catch (error) {
      console.log('사용자 데이터를 불러오는 중 오류가 발생하였습니다.', error)
    }
  }

  const onUploadButtonClick = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.onchange = handleFileInputChange
    fileInput.click()
  }

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedFile(file)
        setImageSrc(reader.result)
        localStorage.setItem('uploadedImage', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onCancelUpload = () => {
    setSelectedFile(null)
    setImageSrc(defaultImage)
    localStorage.removeItem('uploadedImage')
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/checklogin',
          {
            withCredentials: true,
          }
        )
        setIsLoggedIn(response.data.isLoggedIn)

        if (!response.data.isLoggedIn) {
          alert('로그인 후 사용 가능합니다.')
          navigate('/login')
        } else {
          fetchUserData()

          const storedImage = localStorage.getItem('uploadedImage')
          if (storedImage) {
            setImageSrc(storedImage)
            setSelectedFile(null)
          }
        }
      } catch (error) {
        console.log('로그인 상태를 확인하는 중 오류가 발생하였습니다.', error)
      }
    }

    checkLoginStatus()
  }, [])

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get')
        if (Array.isArray(response.data)) {
          const processedData = response.data.map((item) => ({
            ...item,
            content: item.content.replace(/(?:\r\n|\r|\n)/g, '<br>'),
          }))
          setBoardData(processedData)
        }
      } catch (error) {
        console.log('게시물 데이터를 불러오는 중 오류가 발생하였습니다.', error)
      }
    }

    if (isLoggedIn) {
      fetchBoardData()
    }
  }, [isLoggedIn])

  return (
    <>
      {isLoggedIn ? (
        <div>
          <h1>마이페이지</h1>
          <div>
            <img
              width={'300px'}
              src={imageSrc}
              alt="프로필 이미지"
              className="profile-image"
            />
            <button onClick={onUploadButtonClick}>이미지 선택</button>
            <button onClick={onCancelUpload}>업로드 취소</button>
          </div>
          {userData && (
            <div>
              <p>사용자명: {userData.username}</p>
              <p>비밀번호: {userData.password}</p>
            </div>
          )}
          <hr />
          <div>
            {boardData.map((item) => (
              <div key={item.idx}>
                <p>제목: {item.title}</p>
                <p>내용: {ReactHtmlParser(item.content)}</p>
              </div>
            ))}
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>내용</th>
                </tr>
              </thead>
              <tbody>
                {boardData.map((item) => (
                  <tr key={item.idx}>
                    <td>{item.title}</td>
                    <td>{ReactHtmlParser(item.content)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Mypage
