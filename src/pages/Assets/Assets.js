import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Grid, 
  List, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Calendar, 
  FileImage, 
  Video, 
  MoreVertical,
  CheckSquare,
  Square,
  X,
  Image as ImageIcon,
  Play,
  Clock,
  HardDrive
} from 'lucide-react';
import Notification from '../../components/Notification';
import SafeImage from '../../components/SafeImage';
import './Assets.css';

const Assets = () => {
  // State management
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'images', 'videos'
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(null);
  
  // Mock data for demonstration
  const mockAssets = [
    {
      id: 1,
      type: 'image',
      name: 'تصویر ویرایش شده 1',
      url: 'https://picsum.photos/400/300?random=1',
      thumbnail: 'https://picsum.photos/200/150?random=1',
      size: '2.4 MB',
      createdAt: '2024-01-15T10:30:00Z',
      model: 'fal-ai/flux/krea',
      prompt: 'یک منظره طبیعی زیبا با کوه‌های برفی',
      dimensions: '1024x768'
    },
    {
      id: 2,
      type: 'video',
      name: 'ویدیوی تولید شده 1',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://picsum.photos/200/150?random=2',
      size: '15.2 MB',
      createdAt: '2024-01-14T15:45:00Z',
      model: 'fal-ai/veo3/fast',
      prompt: 'اقیانوس آرام با امواج ملایم در غروب',
      duration: '5s',
      dimensions: '1280x720'
    },
    {
      id: 3,
      type: 'image',
      name: 'تصویر خلاقانه 2',
      url: 'https://picsum.photos/400/300?random=3',
      thumbnail: 'https://picsum.photos/200/150?random=3',
      size: '3.1 MB',
      createdAt: '2024-01-13T09:20:00Z',
      model: 'fal-ai/flux/krea',
      prompt: 'شهر مدرن در شب با نورهای رنگارنگ',
      dimensions: '1024x1024'
    },
    {
      id: 4,
      type: 'video',
      name: 'انیمیشن طبیعت',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://picsum.photos/200/150?random=4',
      size: '22.8 MB',
      createdAt: '2024-01-12T14:10:00Z',
      model: 'fal-ai/veo3/fast/image-to-video',
      prompt: 'جنگل سبز با پرندگان پرواز کننده',
      duration: '10s',
      dimensions: '1920x1080'
    },
    {
      id: 5,
      type: 'image',
      name: 'هنر دیجیتال',
      url: 'https://picsum.photos/400/300?random=5',
      thumbnail: 'https://picsum.photos/200/150?random=5',
      size: '1.8 MB',
      createdAt: '2024-01-11T11:30:00Z',
      model: 'fal-ai/flux/krea',
      prompt: 'نقاشی انتزاعی با رنگ‌های زنده',
      dimensions: '768x768'
    },
    {
      id: 6,
      type: 'video',
      name: 'حرکت آب',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://picsum.photos/200/150?random=6',
      size: '18.5 MB',
      createdAt: '2024-01-10T16:20:00Z',
      model: 'fal-ai/veo3/fast',
      prompt: 'آبشار زیبا در میان صخره‌ها',
      duration: '8s',
      dimensions: '1280x720'
    }
  ];
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAssets(mockAssets);
      setFilteredAssets(mockAssets);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  useEffect(() => {
    // Filter assets based on search term and filter type
    let filtered = assets;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(asset => 
        filterType === 'images' ? asset.type === 'image' : asset.type === 'video'
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAssets(filtered);
  }, [assets, searchTerm, filterType]);
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleSelectAsset = (assetId) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };
  
  const handleDownloadAsset = (asset) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = `${asset.name}.${asset.type === 'image' ? 'jpg' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`دانلود ${asset.name} شروع شد`, 'success');
  };
  
  const handleDeleteAsset = (assetId) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    setSelectedAssets(prev => prev.filter(id => id !== assetId));
    showNotification('فایل حذف شد', 'success');
  };
  
  const handleBulkDownload = () => {
    const selectedAssetData = assets.filter(asset => selectedAssets.includes(asset.id));
    selectedAssetData.forEach(asset => {
      setTimeout(() => handleDownloadAsset(asset), 100);
    });
    showNotification(`دانلود ${selectedAssets.length} فایل شروع شد`, 'success');
  };
  
  const handleBulkDelete = () => {
    setAssets(prev => prev.filter(asset => !selectedAssets.includes(asset.id)));
    showNotification(`${selectedAssets.length} فایل حذف شد`, 'success');
    setSelectedAssets([]);
  };
  
  const handlePreview = (asset) => {
    setShowPreview(asset);
  };
  
  const closePreview = () => {
    setShowPreview(null);
  };
  
  const getTotalSize = () => {
    return assets.reduce((total, asset) => {
      const size = parseFloat(asset.size.replace(' MB', ''));
      return total + size;
    }, 0).toFixed(1);
  };
  
  if (isLoading) {
    return (
      <div className="assets-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>در حال بارگذاری فایل‌ها...</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="assets-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FolderOpen className="icon" />
          </div>
          <div className="header-text">
            <h1>فایل‌های من</h1>
            <p>مدیریت تصاویر و ویدیوهای تولید شده</p>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <FileImage size={20} />
            <span>{assets.filter(a => a.type === 'image').length} تصویر</span>
          </div>
          <div className="stat-item">
            <Video size={20} />
            <span>{assets.filter(a => a.type === 'video').length} ویدیو</span>
          </div>
          <div className="stat-item">
            <HardDrive size={20} />
            <span>{getTotalSize()} MB</span>
          </div>
        </div>
      </div>
      
      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-filter-section">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="جستجو در فایل‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              <Filter size={16} />
              همه
            </button>
            <button 
              className={`filter-btn ${filterType === 'images' ? 'active' : ''}`}
              onClick={() => setFilterType('images')}
            >
              <ImageIcon size={16} />
              تصاویر
            </button>
            <button 
              className={`filter-btn ${filterType === 'videos' ? 'active' : ''}`}
              onClick={() => setFilterType('videos')}
            >
              <Video size={16} />
              ویدیوها
            </button>
          </div>
        </div>
        
        <div className="view-controls">
          {selectedAssets.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedAssets.length} انتخاب شده</span>
              <button className="bulk-btn download" onClick={handleBulkDownload}>
                <Download size={16} />
                دانلود
              </button>
              <button className="bulk-btn delete" onClick={handleBulkDelete}>
                <Trash2 size={16} />
                حذف
              </button>
            </div>
          )}
          
          <div className="view-mode-buttons">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Assets Content */}
      {filteredAssets.length === 0 ? (
        <div className="empty-state">
          <FolderOpen className="empty-icon" />
          <h3>هیچ فایلی یافت نشد</h3>
          <p>
            {searchTerm || filterType !== 'all' 
              ? 'فیلتر یا جستجوی خود را تغییر دهید'
              : 'هنوز فایلی تولید نکرده‌اید. شروع کنید!'
            }
          </p>
        </div>
      ) : (
        <div className="assets-content">
          {/* Select All */}
          <div className="select-all-bar">
            <button className="select-all-btn" onClick={handleSelectAll}>
              {selectedAssets.length === filteredAssets.length ? (
                <CheckSquare size={20} />
              ) : (
                <Square size={20} />
              )}
              {selectedAssets.length === filteredAssets.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
            </button>
            <span className="results-count">
              {filteredAssets.length} فایل یافت شد
            </span>
          </div>
          
          {/* Assets Grid/List */}
          <div className={`assets-container ${viewMode}`}>
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                className={`asset-item ${selectedAssets.includes(asset.id) ? 'selected' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="asset-checkbox">
                  <button 
                    className="checkbox-btn"
                    onClick={() => handleSelectAsset(asset.id)}
                  >
                    {selectedAssets.includes(asset.id) ? (
                      <CheckSquare size={20} />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </div>
                
                <div className="asset-thumbnail" onClick={() => handlePreview(asset)}>
                  <SafeImage src={asset.thumbnail} alt={asset.name} />
                  {asset.type === 'video' && (
                    <div className="video-overlay">
                      <Play className="play-icon" />
                      <span className="duration">{asset.duration}</span>
                    </div>
                  )}
                  <div className="type-badge">
                    {asset.type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
                  </div>
                </div>
                
                <div className="asset-info">
                  <h3 className="asset-name">{asset.name}</h3>
                  <p className="asset-prompt">{asset.prompt}</p>
                  
                  <div className="asset-meta">
                    <div className="meta-row">
                      <Calendar size={14} />
                      <span>{formatDate(asset.createdAt)}</span>
                    </div>
                    <div className="meta-row">
                      <HardDrive size={14} />
                      <span>{asset.size}</span>
                    </div>
                    <div className="meta-row">
                      <span className="dimensions">{asset.dimensions}</span>
                    </div>
                  </div>
                  
                  <div className="model-badge">
                    {asset.model}
                  </div>
                </div>
                
                <div className="asset-actions">
                  <button 
                    className="action-btn preview"
                    onClick={() => handlePreview(asset)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="action-btn download"
                    onClick={() => handleDownloadAsset(asset)}
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePreview}>
              <X size={24} />
            </button>
            
            <div className="preview-media">
              {showPreview.type === 'image' ? (
                <SafeImage src={showPreview.url} alt={showPreview.name} />
              ) : (
                <video controls autoPlay>
                  <source src={showPreview.url} type="video/mp4" />
                </video>
              )}
            </div>
            
            <div className="preview-info">
              <h3>{showPreview.name}</h3>
              <p>{showPreview.prompt}</p>
              
              <div className="preview-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(showPreview.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <HardDrive size={16} />
                  <span>{showPreview.size}</span>
                </div>
                <div className="meta-item">
                  <span>{showPreview.dimensions}</span>
                </div>
                {showPreview.duration && (
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{showPreview.duration}</span>
                  </div>
                )}
              </div>
              
              <div className="preview-actions">
                <button 
                  className="preview-btn download"
                  onClick={() => handleDownloadAsset(showPreview)}
                >
                  <Download size={16} />
                  دانلود
                </button>
                <button 
                  className="preview-btn delete"
                  onClick={() => {
                    handleDeleteAsset(showPreview.id);
                    closePreview();
                  }}
                >
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </motion.div>
  );
};

export default Assets;