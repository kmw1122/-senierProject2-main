import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
        'http://localhost:3001/api/signup',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log(response.data.message)

      // 회원가입 후 대기 시간 설정
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const loginResponse = await axios.post(
        'http://localhost:3001/api/login',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log(loginResponse.data.message)
      navigate('/') // 페이지 이동
    } catch (error) {
      console.log('회원가입 요청 중 오류가 발생하였습니다.')
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp
