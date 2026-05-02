import { Link, Route, Routes } from 'react-router-dom'
import { MapPage } from './pages/MapPage'
import { DirectoryPage } from './pages/DirectoryPage'
import { WeatherPage } from './pages/WeatherPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { RulesPage } from './pages/RulesPage'
import { SubmitPage } from './pages/SubmitPage'
import { AdminPage } from './pages/AdminPage'

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <h1>Sur Compass</h1>
        <nav>
          {['/map','/weather','/directory','/emergency','/rules','/submit','/admin'].map((p)=><Link key={p} to={p}>{p.replace('/','')}</Link>)}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}
