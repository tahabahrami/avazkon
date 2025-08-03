import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../../components/Notification';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: 'info', message: '', isVisible: false });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const showNotification = (type, message, duration = 5000) => {
    setNotification({ type, message, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, duration);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showNotification('error', 'لطفاً تمام فیلدها را پر کنید');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      showNotification('success', 'ورود موفقیت‌آمیز بود!');
      setTimeout(() => {
        navigate('/edit-image');
      }, 1000);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@pixie.com',
      password: 'demo123'
    });
    
    setIsLoading(true);
    
    try {
      await login('demo@pixie.com', 'demo123');
      showNotification('success', 'ورود دمو موفقیت‌آمیز بود!');
      setTimeout(() => {
        navigate('/edit-image');
      }, 1000);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Elements */}
      <div className="login-background">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-gradient-3"></div>
      </div>

      {/* Main Content */}
      <div className="login-container">
        {/* Left Side - Branding */}
        <motion.div 
          className="login-branding"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="brand-content">
            <div className="brand-logo">
              <Sparkles size={48} />
            </div>
            <h1>پیکسی</h1>
            <p className="brand-tagline">هوش مصنوعی خلاق برای تصاویر و ویدیوها</p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <span>ویرایش پیشرفته تصاویر</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎨</div>
                <span>تولید تصاویر خلاقانه</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎬</div>
                <span>ساخت ویدیوهای هوشمند</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📁</div>
                <span>مدیریت دارایی‌های دیجیتال</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          className="login-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="login-form-wrapper">
            <div className="form-header">
              <h2>ورود به حساب کاربری</h2>
              <p>به پیکسی خوش آمدید</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">ایمیل</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ایمیل خود را وارد کنید"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">رمز عبور</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="رمز عبور خود را وارد کنید"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="spinner" size={20} />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <ArrowLeft size={20} />
                    ورود
                  </>
                )}
              </button>
            </form>

            <div className="form-divider">
              <span>یا</span>
            </div>

            <button 
              type="button" 
              className="demo-btn"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <Sparkles size={20} />
              ورود دمو (بدون ثبت‌نام)
            </button>

            <div className="form-footer">
              <p>با ورود به پیکسی، شما با <a href="#">شرایط استفاده</a> و <a href="#">حریم خصوصی</a> موافقت می‌کنید.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Login;