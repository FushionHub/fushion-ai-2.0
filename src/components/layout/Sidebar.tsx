import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Image, 
  Video, 
  Mic, 
  Code, 
  FileText, 
  Users, 
  Settings, 
  CreditCard,
  Zap,
  Brain,
  Camera,
  PenTool,
  BarChart3,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { logout } from '@/lib/firebase';

const Sidebar = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    currentPage, 
    setCurrentPage, 
    user, 
    setUser, 
    setAuthenticated 
  } = useStore();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'text-blue-400' },
    { id: 'image', label: 'Image Generator', icon: Image, color: 'text-purple-400' },
    { id: 'video', label: 'Video Generator', icon: Video, color: 'text-red-400' },
    { id: 'audio', label: 'Audio Generator', icon: Mic, color: 'text-green-400' },
    { id: 'code', label: 'Code Generator', icon: Code, color: 'text-yellow-400' },
    { id: 'documents', label: 'Documents', icon: FileText, color: 'text-indigo-400' },
    { id: 'face-swap', label: 'Face Swap', icon: Camera, color: 'text-pink-400' },
    { id: 'content', label: 'Content Creator', icon: PenTool, color: 'text-orange-400' },
    { id: 'blog', label: 'Blog Generator', icon: Brain, color: 'text-cyan-400' },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-emerald-400' },
    { id: 'admin-users', label: 'Users', icon: Users, color: 'text-blue-400' },
    { id: 'admin-settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
  ];

  const userItems = [
    { id: 'profile', label: 'Profile', icon: User, color: 'text-gray-400' },
    { id: 'billing', label: 'Billing', icon: CreditCard, color: 'text-green-400' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 z-50 lg:relative lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Fusion AI 2.0</h1>
                  <p className="text-sm text-gray-400">AI Model Like No Other</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{user.displayName || 'User'}</p>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">{user.tokens} tokens</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* AI Features */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                AI Features
              </h3>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${currentPage === item.id ? item.color : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Admin Section */}
            {user?.isAdmin && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Admin
                </h3>
                <div className="space-y-1">
                  {adminItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        currentPage === item.id
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${currentPage === item.id ? item.color : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* User Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Account
              </h3>
              <div className="space-y-1">
                {userItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-gray-600/20 text-gray-300 border border-gray-500/30'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${currentPage === item.id ? item.color : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden bg-gray-900/90 backdrop-blur-sm text-white p-2 rounded-lg border border-gray-700"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export default Sidebar;