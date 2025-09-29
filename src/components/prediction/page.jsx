
import Header from './../common/Header';
import "./globals.css"
import RicePredictionDashboard from './RicePredictionDash';

export default function RicePredictionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <RicePredictionDashboard />
    </div>
  )
}
