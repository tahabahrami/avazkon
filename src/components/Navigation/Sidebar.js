import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Edit3, 
  ImagePlus, 
  Video, 
  FolderOpen, 
  User, 
  CreditCard,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SafeImage from '../SafeImage';
import './Sidebar.css';

const Sidebar = ({ onToggleCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle window resize to detect mobile/desktop
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Force sidebar to be expanded on desktop
      if (!mobile && isCollapsed) {
        setIsCollapsed(false);
        if (onToggleCollapse) {
          onToggleCollapse(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, onToggleCollapse]);

  const menuItems = [
    {
      id: 'social-feed',
      path: '/social-feed',
      icon: Users,
      label: 'فید اجتماعی',
      description: 'کشف آثار خلاقانه کاربران'
    },
    {
      id: 'edit-image',
      path: '/edit-image',
      icon: Edit3,
      label: 'ویرایش تصویر',
      description: 'ویرایش و بهبود تصاویر'
    },
    {
      id: 'create-image',
      path: '/create-image',
      icon: ImagePlus,
      label: 'ساخت تصویر',
      description: 'تولید تصاویر جدید'
    },
    {
      id: 'create-video',
      path: '/create-video',
      icon: Video,
      label: 'ساخت ویدیو',
      description: 'تولید ویدیوهای هوشمند'
    },
    {
      id: 'assets',
      path: '/assets',
      icon: FolderOpen,
      label: 'دارایی‌ها',
      description: 'مدیریت فایل‌های شما'
    },
    {
      id: 'credits',
      path: '/credits',
      icon: CreditCard,
      label: 'کردیت‌ها',
      description: 'مدیریت کردیت و خرید بسته‌ها'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: User,
      label: 'پروفایل',
      description: 'تنظیمات و آمار کاربری'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    expanded: {
      width: '280px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: '100px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${!isMobile ? 'desktop-always-expanded' : (isCollapsed ? 'collapsed' : 'expanded')} ${isMobileOpen ? 'mobile-open' : ''}`}
        variants={sidebarVariants}
        animate={!isMobile ? 'expanded' : (isCollapsed ? 'collapsed' : 'expanded')}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <Sparkles size={28} />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="logo-text"
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  <h1>پیکسی</h1>
                  <span>هوش مصنوعی خلاق</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Desktop Toggle - Hidden on desktop */}
          {isMobile && (
            <button 
              className="toggle-btn desktop-only"
              onClick={() => {
                const newCollapsedState = !isCollapsed;
                setIsCollapsed(newCollapsedState);
                if (onToggleCollapse) {
                  onToggleCollapse(newCollapsedState);
                }
              }}
            >
              <ChevronRight className={isCollapsed ? 'rotated' : ''} />
            </button>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar">
            <SafeImage 
              src={user?.avatar} 
              alt={user?.name} 
              className="user-avatar-img"
              fallbackType="avatar"
            />
            <div className="status-indicator"></div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="user-info"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <div className="user-name">{user?.name}</div>
                <div className="user-plan">{user?.subscription === 'premium' ? 'پریمیوم' : 'رایگان'}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className="nav-icon">
                      <Icon size={20} />
                    </div>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          className="nav-content"
                          variants={contentVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                        >
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-description">{item.description}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isActive && <div className="active-indicator" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  خروج
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;