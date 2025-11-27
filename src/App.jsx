import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import RicePredictionPage from './components/prediction/page'

import RiceYeildPrediction from './components/yeild/RiceYeildPrediction'
import Contact from './pages/Contact'
import FAQ from './pages/faq'
import FarmInputForm from './components/prediction/farm-input-form'
import ResultsPage from './components/prediction/results/ResultsPage'
import WeatherPage from './components/weather/page/WeatherPage'
import ContactPage from './pages/Contact'
import LoginPage from './components/auth/Login'
import RegisterPage from './components/auth/Register'
import FarmerAssistance from './components/prediction/WeatherPrediction'
import CropPredidictionTwo from './components/weather/Weather'
import CropAssessmentPage from './components/weather/CropResults'
import CropPredictTwo from './components/weather/Weather'
import CropResultAI from './components/weather/CropResultAI'

function App() {

  return (
   <Routes>
    <Route path="/" element={<Home />} />
    {/* <Route path="/about" element={<About />} /> */}
    {/* <Route path="/predict" element={<RicePredictionPage />} /> */}
    <Route path="/predict" element={<FarmInputForm />} />
    <Route path="/results" element={<ResultsPage />} />
    <Route path="/yeild" element={<RiceYeildPrediction />} />
    <Route path="/weather" element={<WeatherPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/faq" element={<FAQ />} />
    {/* login and register routes  */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/weathertwo" element={<CropPredictTwo />} />
    <Route path="/crop-assessment" element={<CropAssessmentPage />} />
    <Route path="/result" element={<CropResultAI />} />


   </Routes>
  )
}

export default App
