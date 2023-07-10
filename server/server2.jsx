const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mysql = require('mysql')

const app = express()
const PORT = 3001

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kmw1122!',
  database: 'login_database',
})

// MySQL 연결
connection.connect((error) => {
  if (error) {
    console.error('MySQL 연결 오류:', error)
    return res.status(500).json({ message: '서버 오류가 발생하였습니다.' })
  }
  console.log('MySQL에 성공적으로 연결되었습니다.')
})

// 회원가입 정보 테이블 생성
connection.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`,
  (err, results) => {
    if (err) {
      console.error('테이블 생성 오류:', err)
      return
    }
    console.log('users 테이블이 생성되었습니다.')
  }
)

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(bodyParser.json())
app.use(cookieParser())

// 선언 및 초기화
const users = []

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body

  // 회원가입 검증 로직
  if (!username || !password) {
    return res.status(400).json({ message: '입력값이 올바르지 않습니다.' })
  }

  // 중복 가입 여부 확인
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('회원 조회 오류:', err)
        return res.status(500).json({ message: '서버 오류가 발생하였습니다.' })
      }

      if (results.length > 0) {
        return res.status(409).json({ message: '이미 가입된 사용자입니다.' })
      }

      // 회원가입 처리
      connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err, results) => {
          if (err) {
            console.error('회원가입 오류:', err)
            return res
              .status(500)
              .json({ message: '서버 오류가 발생하였습니다.' })
          }

          return res
            .status(200)
            .json({ message: '회원가입이 성공적으로 완료되었습니다.' })
        }
      )
    }
  )
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  // 로그인 검증 로직
  if (!username || !password) {
    return res.status(400).json({ message: '입력값이 올바르지 않습니다.' })
  }

  // 사용자 검증
  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('사용자 조회 오류:', err)
        return res.status(500).json({ message: '서버 오류' })
      }

      if (results.length === 0) {
        return res.status(401).json({ message: '인증 실패' })
      }

      const userId = results[0].id

      // 인증에 성공하면 유저 아이디를 쿠키에 저장합니다.
      res.cookie('userId', userId, {
        maxAge: 86400000, // 쿠키 유효기간 설정 (예: 24시간)
        httpOnly: true,
        sameSite: 'strict',
      })

      res.status(200).json({
        message: '로그인 성공',
        token: 'your_token_here',
      })
    }
  )
})

app.post('/api/logout', (req, res) => {
  res.clearCookie('userId')
  res.sendStatus(200)
})

app.get('/api/checklogin', (req, res) => {
  const isLoggedIn = req.cookies.userId ? true : false
  res.json({ isLoggedIn })
})

app.get('/api/userdata', (req, res) => {
  const isLoggedIn = req.cookies.userId ? true : false

  if (isLoggedIn) {
    // 데이터베이스에서 로그인된 사용자의 데이터를 조회합니다.
    connection.query(
      'SELECT * FROM users WHERE id = ?',
      [req.cookies.userId],
      (err, results) => {
        if (err) {
          console.error('사용자 데이터 조회 오류:', err)
          res.status(500).json({ message: '서버 오류가 발생하였습니다.' })
          return
        }

        if (results.length === 0) {
          res.status(404).json({ message: '사용자 데이터를 찾을 수 없습니다.' })
          return
        }

        const userData = results[0]
        res.status(200).json(userData)
      }
    )
  } else {
    res.status(401).json({ message: '로그인되어 있지 않습니다.' })
  }
})

// 추가된 라우트 핸들러
app.get('/api/login', (req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`)
})
