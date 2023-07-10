const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const axios = require('axios')
const PORT = process.env.PORT || 8000

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kmw1122!',
  database: 'simpleboard',
})

app.use(cors())
app.use(express.json())

app.get('/api/userdata', (req, res) => {
  const userData = {
    username: 'kmw1122',
    password: '123456',
  }
  res.send(userData)
})

app.get('/api/checklogin', (req, res) => {
  const isLoggedIn = true
  res.send({ isLoggedIn })
})

app.get('/api/get', (req, res) => {
  const sqlQuery = 'SELECT * FROM simpleboard ORDER BY idx ASC'
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('An error occurred while fetching data.')
    } else {
      res.send(result)
    }
  })
})

app.get('/api/get/:idx', (req, res) => {
  const idx = req.params.idx
  const sqlQuery = 'SELECT * FROM simpleboard WHERE idx = ?'
  db.query(sqlQuery, [idx], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('An error occurred while fetching data.')
    } else {
      if (result.length > 0) {
        res.send(result[0])
      } else {
        res.status(404).send('Post not found.')
      }
    }
  })
})

app.post('/api/insert', (req, res) => {
  const title = req.body.title
  const content = req.body.content
  const sqlQuery = 'INSERT INTO simpleboard (title, content) VALUES (?,?)'
  db.query(sqlQuery, [title, content], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('An error occurred while inserting data.')
    } else {
      res.send('Success!')
    }
  })
})

app.delete('/api/delete/:idx', (req, res) => {
  const idx = req.params.idx
  const sqlQuery = 'DELETE FROM simpleboard WHERE idx = ?'
  db.query(sqlQuery, [idx], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('An error occurred while deleting data.')
    } else {
      res.send('Success!')
    }
  })
})

app.put('/api/update/:idx', (req, res) => {
  const idx = req.params.idx
  let title = req.body.title
  let content = req.body.content

  // 태그 제거 함수 추가
  function removeTags(str) {
    if (str === null || str === '') return false
    else str = str.toString()

    return str.replace(/(<([^>]+)>)/gi, '')
  }

  // 태그 제거
  title = removeTags(title)
  content = removeTags(content)

  const sqlQuery = 'UPDATE simpleboard SET title = ?, content = ? WHERE idx = ?'
  db.query(sqlQuery, [title, content, idx], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('An error occurred while updating data.')
    } else {
      res.send('Success!')
    }
  })
})

app.get('/api/getLiked', (req, res) => {
  const sqlQuery = 'SELECT * FROM simpleboard ORDER BY likes DESC'
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.')
    } else {
      res.send(result)
    }
  })
})

// 좋아요 업데이트를 수행할 핸들러 함수
app.put('/api/like/:idx', (req, res) => {
  const idx = req.params.idx
  const sqlQuery = 'UPDATE simpleboard SET likes = likes + 1 WHERE idx = ?'
  db.query(sqlQuery, [idx], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('An error occurred while updating like.')
    } else {
      res.send('Success!')
    }
  })
})

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
