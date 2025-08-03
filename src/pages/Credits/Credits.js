import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Coins,
  TrendingUp,
  Clock,
  Package,
  Star,
  Zap,
  Crown,
  Gift,
  History,
  Download,
  Image,
  Video,
  Edit3,
  CheckCircle,
  AlertCircle,
  Plus,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Credits.css';

const Credits = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Mock credit data - in real app, this would come from API
  const creditData = {
    balance: 150,
    totalSpent: 850,
    totalPurchased: 1000,
    monthlyUsage: [
      { month: 'فروردین', spent: 45, earned: 0 },
      { month: 'اردیبهشت', spent: 67, earned: 10 },
      { month: 'خرداد', spent: 89, earned: 0 },
      { month: 'تیر', spent: 123, earned: 20 },
      { month: 'مرداد', spent: 156, earned: 0 },
      { month: 'شهریور', spent: 189, earned: 15 }
    ],
    recentTransactions: [
      {
        id: 1,
        type: 'spent',
        action: 'image_generation',
        description: 'تولید تصویر با FLUX Krea',
        amount: -5,
        timestamp: '2 ساعت پیش',
        icon: Image
      },
      {
        id: 2,
        type: 'spent',
        action: 'video_generation',
        description: 'تولید ویدیو با VEO3 Fast',
        amount: -15,
        timestamp: '5 ساعت پیش',
        icon: Video
      },
      {
        id: 3,
        type: 'spent',
        action: 'image_edit',
        description: 'ویرایش تصویر پیشرفته',
        amount: -3,
        timestamp: '1 روز پیش',
        icon: Edit3
      },
      {
        id: 4,
        type: 'earned',
        action: 'referral_bonus',
        description: 'پاداش معرفی کاربر جدید',
        amount: +10,
        timestamp: '2 روز پیش',
        icon: Gift
      },
      {
        id: 5,
        type: 'purchased',
        action: 'package_purchase',
        description: 'خرید بسته 100 کردیت',
        amount: +100,
        timestamp: '3 روز پیش',
        icon: Package
      }
    ]
  };

  const creditPackages = [
    {
      id: 'starter',
      name: 'بسته شروع',
      credits: 10,
      price: 1000000, // 100,000 tomans
      originalPrice: null,
      popular: false,
      features: [
        '10 کردیت برای شروع',
        'دسترسی به تمام مدل‌ها',
        'کیفیت استاندارد',
        'پشتیبانی عمومی'
      ],
      icon: Zap,
      color: 'blue'
    },
    {
      id: 'popular',
      name: 'بسته محبوب',
      credits: 100,
      price: 9000000, // 900,000 tomans (10% discount)
      originalPrice: 10000000,
      popular: true,
      features: [
        '100 کردیت با تخفیف',
        'دسترسی به تمام مدل‌ها',
        'کیفیت بالا',
        'پشتیبانی اولویت‌دار',
        '10% تخفیف'
      ],
      icon: Star,
      color: 'purple'
    },
    {
      id: 'professional',
      name: 'بسته حرفه‌ای',
      credits: 500,
      price: 42500000, // 4,250,000 tomans (15% discount)
      originalPrice: 50000000,
      popular: false,
      features: [
        '500 کردیت با تخفیف ویژه',
        'دسترسی به تمام مدل‌ها',
        'کیفیت پریمیوم',
        'پشتیبانی اختصاصی',
        '15% تخفیف',
        'دسترسی زودهنگام به ویژگی‌ها'
      ],
      icon: Crown,
      color: 'gold'
    },
    {
      id: 'enterprise',
      name: 'بسته سازمانی',
      credits: 1000,
      price: 80000000, // 8,000,000 tomans (20% discount)
      originalPrice: 100000000,
      popular: false,
      features: [
        '1000 کردیت با بیشترین تخفیف',
        'دسترسی به تمام مدل‌ها',
        'کیفیت فوق‌العاده',
        'پشتیبانی 24/7',
        '20% تخفیف',
        'مدیریت تیم',
        'گزارش‌های تفصیلی'
      ],
      icon: Sparkles,
      color: 'gradient'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price / 10) + ' تومان';
  };

  const handlePurchase = (packageData) => {
    setSelectedPackage(packageData);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    // In real app, this would call payment API
    console.log('Purchasing package:', selectedPackage);
    setShowPurchaseModal(false);
    setSelectedPackage(null);
    // Show success notification
  };

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: TrendingUp },
    { id: 'history', label: 'تاریخچه', icon: History },
    { id: 'packages', label: 'بسته‌ها', icon: Package }
  ];

  return (
    <div className="credits-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <CreditCard className="icon" />
          </div>
          <div className="header-text">
            <h1>کردیت‌ها</h1>
            <p>مدیریت کردیت‌ها و خرید بسته‌های جدید</p>
          </div>
        </div>
      </div>

      {/* Credit Balance Card */}
      <motion.div 
        className="credit-balance-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="balance-header">
          <div className="balance-info">
            <div className="balance-icon">
              <Coins className="icon" />
            </div>
            <div className="balance-text">
              <h2>موجودی کردیت</h2>
              <p>کردیت‌های قابل استفاده شما</p>
            </div>
          </div>
          <div className="balance-amount">
            <span className="amount">{creditData.balance}</span>
            <span className="unit">کردیت</span>
          </div>
        </div>
        
        <div className="balance-stats">
          <div className="stat">
            <div className="stat-icon purchased">
              <Plus className="icon" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{creditData.totalPurchased}</span>
              <span className="stat-label">خریداری شده</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon spent">
              <TrendingUp className="icon" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{creditData.totalSpent}</span>
              <span className="stat-label">مصرف شده</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            <div className="overview-grid">
              {/* Monthly Usage Chart */}
              <div className="usage-chart-card">
                <div className="card-header">
                  <h3>مصرف ماهانه</h3>
                  <p>نمودار مصرف کردیت در 6 ماه گذشته</p>
                </div>
                <div className="chart-container">
                  {creditData.monthlyUsage.map((month, index) => (
                    <div key={month.month} className="chart-bar">
                      <div 
                        className="bar spent"
                        style={{ height: `${(month.spent / 200) * 100}%` }}
                      ></div>
                      {month.earned > 0 && (
                        <div 
                          className="bar earned"
                          style={{ height: `${(month.earned / 200) * 100}%` }}
                        ></div>
                      )}
                      <span className="month-label">{month.month}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color spent"></div>
                    <span>مصرف شده</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color earned"></div>
                    <span>کسب شده</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions-card">
                <div className="card-header">
                  <h3>اقدامات سریع</h3>
                  <p>دسترسی سریع به عملیات مهم</p>
                </div>
                <div className="quick-actions">
                  <button 
                    className="quick-action"
                    onClick={() => setActiveTab('packages')}
                  >
                    <div className="action-icon">
                      <Package className="icon" />
                    </div>
                    <div className="action-text">
                      <span className="action-title">خرید کردیت</span>
                      <span className="action-desc">بسته‌های کردیت</span>
                    </div>
                  </button>
                  <button 
                    className="quick-action"
                    onClick={() => setActiveTab('history')}
                  >
                    <div className="action-icon">
                      <History className="icon" />
                    </div>
                    <div className="action-text">
                      <span className="action-title">تاریخچه</span>
                      <span className="action-desc">مشاهده تراکنش‌ها</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            <div className="history-card">
              <div className="card-header">
                <h3>تاریخچه تراکنش‌ها</h3>
                <p>تمام فعالیت‌های مربوط به کردیت</p>
              </div>
              <div className="transactions-list">
                {creditData.recentTransactions.map((transaction) => {
                  const IconComponent = transaction.icon;
                  return (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-icon">
                        <IconComponent className="icon" />
                      </div>
                      <div className="transaction-info">
                        <div className="transaction-title">{transaction.description}</div>
                        <div className="transaction-time">{transaction.timestamp}</div>
                      </div>
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} کردیت
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'packages' && (
          <motion.div
            key="packages"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            <div className="packages-grid">
              {creditPackages.map((pkg) => {
                const IconComponent = pkg.icon;
                return (
                  <motion.div
                    key={pkg.id}
                    className={`package-card ${pkg.popular ? 'popular' : ''} ${pkg.color}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pkg.popular && (
                      <div className="popular-badge">
                        <Star className="icon" />
                        محبوب
                      </div>
                    )}
                    
                    <div className="package-header">
                      <div className="package-icon">
                        <IconComponent className="icon" />
                      </div>
                      <h3>{pkg.name}</h3>
                    </div>

                    <div className="package-credits">
                      <span className="credits-amount">{pkg.credits}</span>
                      <span className="credits-unit">کردیت</span>
                    </div>

                    <div className="package-price">
                      {pkg.originalPrice && (
                        <span className="original-price">{formatPrice(pkg.originalPrice)}</span>
                      )}
                      <span className="current-price">{formatPrice(pkg.price)}</span>
                    </div>

                    <div className="package-features">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="feature">
                          <CheckCircle className="feature-icon" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      className="purchase-btn"
                      onClick={() => handlePurchase(pkg)}
                    >
                      خرید بسته
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedPackage && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              className="purchase-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>تأیید خرید</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowPurchaseModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="purchase-summary">
                  <div className="package-info">
                    <h4>{selectedPackage.name}</h4>
                    <p>{selectedPackage.credits} کردیت</p>
                  </div>
                  <div className="price-info">
                    <span className="price">{formatPrice(selectedPackage.price)}</span>
                  </div>
                </div>
                
                <div className="payment-info">
                  <div className="info-item">
                    <AlertCircle className="icon" />
                    <span>پرداخت از طریق درگاه امن بانکی انجام می‌شود</span>
                  </div>
                  <div className="info-item">
                    <CheckCircle className="icon" />
                    <span>کردیت‌ها بلافاصله به حساب شما اضافه می‌شوند</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowPurchaseModal(false)}
                >
                  انصراف
                </button>
                <button 
                  className="confirm-btn"
                  onClick={confirmPurchase}
                >
                  تأیید و پرداخت
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Credits;