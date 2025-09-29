import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import RicePredictionPage from './components/prediction/page'

function App() {

  return (
   <Routes>
    <Route path="/" element={<Home />} />
    {/* <Route path="/about" element={<About />} /> */}
    <Route path="/predict" element={<RicePredictionPage />} />

   </Routes>
  )
}

export default App
