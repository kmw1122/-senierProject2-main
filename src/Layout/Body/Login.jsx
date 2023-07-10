import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [responseData, setResponseData] = useState(null) // 응답 데이터 저장

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      console.log('모든 필드를 입력해주세요.')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )

      console.log(response.data.message)
      localStorage.setItem('token', response.data.token) // 로그인 성공 시 토큰을 localStorage에 저장
      navigate('/mypage') // 페이지 이동

      // 서버로부터 받은 데이터를 화면에 표시하기 위해 상태(state)를 업데이트합니다.
      setResponseData(response.data)
    } catch (error) {
      console.log('로그인 요청 중 오류가 발생하였습니다.', error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {responseData && (
        <div>
          <h3>Response Data:</h3>
          <p>Message: {responseData.message}</p>
          <p>Token: {responseData.token}</p>
        </div>
      )}
    </div>
  )
}

export default Login
