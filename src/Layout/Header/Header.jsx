import React, { useState, useEffect } from 'react'
import './Header.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAccusoft } from '@fortawesome/free-brands-svg-icons'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    // 페이지 로딩 시와 로그인 후에 로그인 상태 확인
    checkLoginStatus()
  }, [location])

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/checklogin', {
        withCredentials: true,
      })

      if (response.data.isLoggedIn) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.log('로그인 상태 확인 중 오류가 발생하였습니다.', error)
      handleErrorMessage('로그인 상태 확인 중 오류가 발생하였습니다.')
    }
  }

  const handleLogout = async () => {
    console.log('로그아웃이 호출되었습니다.')
    try {
      await axios.post('http://localhost:3001/api/logout', null, {
        withCredentials: true,
      })

      setIsLoggedIn(false)
      navigate('/')
    } catch (error) {
      console.log('로그아웃 요청 중 오류가 발생하였습니다.', error)
      handleErrorMessage('로그아웃 요청 중 오류가 발생하였습니다.')
    }
  }

  const handleErrorMessage = (message) => {
    setErrorMessage(message)
  }

  // 로그인 상태를 확인하고 로그인 후에 호출되도록 추가된 함수
  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  useEffect(() => {
    // 페이지 로딩 시 로그인 상태 확인
    checkLoginStatus()
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <FontAwesomeIcon icon={faAccusoft} />
        <Link to="/">사이트이름</Link>
      </div>
      <ul className="navbar__menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/community">게시판</Link>
        </li>
        <li>
          <Link to="/mypage">마이페이지</Link>
        </li>
      </ul>
      <ul className="navbar__icons">
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout}>로그아웃</button>
          </li>
        ) : (
          <>
            <li className="login">
              <Link to="/login" onClick={handleLoginSuccess}>
                로그인
              </Link>
            </li>
            <li className="login">
              <Link to="/signup" onClick={handleLoginSuccess}>
                회원가입
              </Link>
            </li>
          </>
        )}
      </ul>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </nav>
  )
}

export default Header
