import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MobileLayout from './layouts/MobileLayout'
import LoginPage from './pages/LoginPage'
import BmsLoginPage from './pages/BmsLoginPage'
import SiteOverviewPage from './pages/SiteOverviewPage'
import OperationStatusPage from './pages/OperationStatusPage'
import CellMatrixPage from './pages/CellMatrixPage'
import DataAnalysisPage from './pages/DataAnalysisPage'
import ReportCenterPage from './pages/ReportCenterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Pages (no bottom nav) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bms-login" element={<BmsLoginPage />} />

        {/* Main App Pages with shared layout */}
        <Route element={<MobileLayout />}>
          <Route path="/overview" element={<SiteOverviewPage />} />
          <Route path="/status" element={<OperationStatusPage />} />
          <Route path="/cell-matrix" element={<CellMatrixPage />} />
          <Route path="/analysis" element={<DataAnalysisPage />} />
          <Route path="/reports" element={<ReportCenterPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
