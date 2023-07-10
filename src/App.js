import './App.css'
import { Route, Routes } from 'react-router-dom'
import Header from './Layout/Header/Header'
import Footer from './Layout/Footer/Footer'
import Home from './Layout/Body/home'
import Community from './Layout/Body/community'
import SignUp from './Layout/Body/SignUp'
import Login from './Layout/Body/Login'
import Mypage from './Layout/Body/Mypage'
import CreatePost from './Layout/Body/CreatePost'
import EditPost from './Layout/Body/EditPost'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/editpost/:idx" element={<EditPost />} />{' '}
      </Routes>
      <Footer />
    </div>
  )
}

export default App
