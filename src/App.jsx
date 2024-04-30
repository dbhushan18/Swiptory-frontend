import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './Pages/HomePage/HomePage'
import { ToastContainer } from 'react-toastify'
import ViewStoryPage from './Pages/ViewSharedStory/ViewStoryPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<HomePage key="home" />} />
          <Route path='/viewstory/:slideId' element={<ViewStoryPage key="story" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
