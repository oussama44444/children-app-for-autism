import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        {/* Admin-specific layout with sidebar */}
        <div className="flex h-screen bg-gray-100">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar Navigation */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-blue-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between lg:block">
                <h1 className="text-xl lg:text-2xl font-bold">📊 Story Admin</h1>
                {/* Close button for mobile */}
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md hover:bg-blue-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-200 text-xs lg:text-sm mt-2">Management Dashboard</p>
            </div>
            
            <nav className="mt-4 lg:mt-6">
              <Link 
                to="/admin" 
                className="block py-3 px-4 lg:px-6 bg-blue-900 border-l-4 border-yellow-400 text-sm lg:text-base"
                onClick={() => setSidebarOpen(false)}
              >
                📋 All Stories
              </Link>
              <Link 
                to="/admin/create" 
                className="block py-3 px-4 lg:px-6 hover:bg-blue-700 border-l-4 border-transparent hover:border-white text-sm lg:text-base transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                ➕ Create Story
              </Link>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            {/* Mobile header */}
            <div className="lg:hidden bg-blue-800 text-white p-4 sticky top-0 z-30 shadow-md">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md hover:bg-blue-700"
                >
                  ☰
                </button>
                <h1 className="text-lg font-bold">📊 Story Admin</h1>
                <div className="w-8"></div> {/* Spacer for balance */}
              </div>
            </div>

            {/* Page content */}
            <div className="p-4 lg:p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/create" element={<AdminDashboard initialView="create" />} />
                <Route path="/admin/edit/:id" element={<AdminDashboard initialView="edit" />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;