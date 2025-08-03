import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Eye,
  Lock,
  Unlock,
  Copy,
  Download,
  MoreHorizontal,
  Filter,
  Search,
  Coins,
  Repeat
} from 'lucide-react';
import SafeImage from '../../components/SafeImage';
import './SocialFeed.css';

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, images, videos, edited
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        type: 'generated_image',
        user: {
          name: 'علی احمدی',
          avatar: 'https://picsum.photos/seed/user1/40/40',
          username: '@ali_ahmadi'
        },
        content: {
          prompt: 'یک منظره زیبای کوهستانی با آسمان آبی و ابرهای سفید',
          prompt_id: 'ABC123', // Reference to prompt database
          result_image: 'https://picsum.photos/seed/mountain1/600/400',
          is_locked: false,
          credit_cost: 0
        },
        stats: {
          likes: 24,
          comments: 8,
          views: 156,
          shares: 3
        },
        created_at: '2 ساعت پیش',
        is_liked: false
      },
      {
        id: 2,
        type: 'edited_image',
        user: {
          name: 'مریم کریمی',
          avatar: 'https://picsum.photos/seed/user2/40/40',
          username: '@maryam_k'
        },
        content: {
          original_image: 'https://picsum.photos/seed/original1/300/400',
          edited_image: 'https://picsum.photos/seed/edited1/300/400',
          edit_description: 'حذف پس‌زمینه و اضافه کردن افکت نوری',
          prompt_id: 'DEF456', // Reference to prompt database
          is_locked: false,
          credit_cost: 0
        },
        stats: {
          likes: 45,
          comments: 12,
          views: 289,
          shares: 7
        },
        created_at: '4 ساعت پیش',
        is_liked: true
      },
      {
        id: 3,
        type: 'generated_video',
        user: {
          name: 'حسین رضایی',
          avatar: 'https://picsum.photos/seed/user3/40/40',
          username: '@hossein_r'
        },
        content: {
          prompt: 'ویدیو کوتاه از حرکت ابرها در آسمان',
          prompt_id: 'GHI789', // Reference to prompt database
          video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail: 'https://picsum.photos/seed/clouds1/600/400',
          is_locked: true,
          credit_cost: 5
        },
        stats: {
          likes: 67,
          comments: 23,
          views: 445,
          shares: 12
        },
        created_at: '6 ساعت پیش',
        is_liked: false
      }
    ];
    
    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter posts based on type and search term
  useEffect(() => {
    let filtered = posts;
    
    if (filter !== 'all') {
      filtered = posts.filter(post => {
        if (filter === 'images') return post.type.includes('image');
        if (filter === 'videos') return post.type.includes('video');
        if (filter === 'edited') return post.type === 'edited_image';
        return true;
      });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.user.name.includes(searchTerm) ||
        post.user.username.includes(searchTerm) ||
        (post.content.prompt && post.content.prompt.includes(searchTerm))
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, filter, searchTerm]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked: !post.is_liked,
            stats: { 
              ...post.stats, 
              likes: post.is_liked ? post.stats.likes - 1 : post.stats.likes + 1 
            }
          }
        : post
    ));
  };

  const handleReusePost = (post) => {
    if (post.content.is_locked) {
      // Show credit deduction modal or handle locked content
      alert(`این محتوا قفل شده است و نیاز به ${post.content.credit_cost} کردیت دارد`);
      return;
    }

    // Navigate to appropriate page with pre-populated data
    if (post.type === 'generated_image') {
      navigate('/create-image', { 
        state: { 
          postData: {
            prompt: post.content.prompt,
            promptId: post.content.prompt_id, // Pass prompt ID for tag creation
            isLocked: post.content.is_locked,
            creditCost: post.content.credit_cost,
            referenceImage: post.content.result_image,
            parameters: {
              width: 1024,
              height: 1024,
              style: 'realistic'
            }
          }
        }
      });
    } else if (post.type === 'edited_image') {
      navigate('/edit-image', { 
        state: { 
          postData: {
            prompt: post.content.edit_description,
            promptId: post.content.prompt_id, // Pass prompt ID for tag creation
            isLocked: post.content.is_locked,
            creditCost: post.content.credit_cost,
            originalImage: post.content.original_image,
            editedImage: post.content.edited_image,
            parameters: {
              guidance_scale: 3.5,
              creativity: 7
            }
          }
        }
      });
    } else if (post.type === 'generated_video') {
      navigate('/create-video', { 
        state: { 
          postData: {
            prompt: post.content.prompt,
            promptId: post.content.prompt_id, // Pass prompt ID for tag creation
            isLocked: post.content.is_locked,
            creditCost: post.content.credit_cost,
            startImage: post.content.result_image,
            parameters: {
              duration: 5,
              fps: 24,
              aspectRatio: '16:9'
            }
          }
        }
      });
    }
  };

  const VideoPlayer = ({ post }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    return (
      <div className="video-container">
        <video 
          className="post-video"
          poster={post.content.thumbnail}
          muted={isMuted}
          loop
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <source src={post.content.video_url} type="video/mp4" />
        </video>
        <div className="video-controls">
          <button 
            className="play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button 
            className="mute-btn"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        {post.content.is_locked && (
          <div className="locked-overlay">
            <Lock size={32} />
            <span>{post.content.credit_cost} کردیت</span>
          </div>
        )}
      </div>
    );
  };

  const PostCard = ({ post }) => {
    return (
      <div className="post-card">
        {/* Post Header */}
        <div className="post-header">
          <div className="user-info">
            <SafeImage 
              src={post.user.avatar} 
              alt={post.user.name} 
              className="user-avatar" 
              fallbackType="avatar"
            />
            <div className="user-details">
              <h4 className="user-name">{post.user.name}</h4>
              <span className="username">{post.user.username}</span>
              <span className="post-time">{post.created_at}</span>
            </div>
          </div>
          <button className="more-btn">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Post Content */}
        <div className="post-content">
          {post.type === 'generated_image' && (
            <div className="image-content">
              <SafeImage 
                src={post.content.result_image} 
                alt="Generated" 
                className="post-image" 
                fallbackType="general"
              />
              {!post.content.is_locked && (
                <div className="prompt-overlay">
                  <p className="prompt-text">{post.content.prompt}</p>
                </div>
              )}
              {post.content.is_locked && (
                <div className="locked-overlay">
                  <Lock size={32} />
                  <span>{post.content.credit_cost} کردیت</span>
                </div>
              )}
            </div>
          )}

          {post.type === 'edited_image' && (
            <div className="edited-content">
              <div className="image-comparison">
                <div className="before-after">
                  <div className="image-half">
                    <SafeImage 
                      src={post.content.original_image} 
                      alt="Original" 
                      className="comparison-image" 
                      fallbackType="general"
                    />
                    <span className="image-label">قبل</span>
                  </div>
                  <div className="image-half">
                    <SafeImage 
                      src={post.content.edited_image} 
                      alt="Edited" 
                      className="comparison-image" 
                      fallbackType="general"
                    />
                    <span className="image-label">بعد</span>
                  </div>
                </div>
              </div>
              <p className="edit-description">{post.content.edit_description}</p>
            </div>
          )}

          {post.type === 'generated_video' && (
            <VideoPlayer post={post} />
          )}
        </div>

        {/* Post Actions */}
        <div className="post-actions">
          <button 
            className={`action-btn like-btn ${post.is_liked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike(post.id);
            }}
          >
            <Heart size={20} fill={post.is_liked ? '#ef4444' : 'none'} />
            <span>{post.stats.likes}</span>
          </button>
          
          <button className="action-btn comment-btn">
            <MessageCircle size={20} />
            <span>{post.stats.comments}</span>
          </button>
          
          <button className="action-btn share-btn">
            <Share2 size={20} />
            <span>{post.stats.shares}</span>
          </button>
          
          <button 
            className="reuse-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleReusePost(post);
            }}
            title="استفاده مجدد از این تنظیمات"
          >
            <Repeat size={16} />
            <span>استفاده مجدد</span>
          </button>
          
          <div className="views-count">
            <Eye size={16} />
            <span>{post.stats.views}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="social-feed-loading">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری فید اجتماعی...</p>
      </div>
    );
  }

  return (
    <div className="social-feed">
      {/* Compact Header */}
      <div className="feed-header">
        <div className="header-content">
          <h1 className="page-title">فید اجتماعی</h1>
        </div>
      </div>

      {/* Sticky Controls */}
      <div className="feed-controls-sticky">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Compact Filter Pills */}
        <div className="filter-pills">
          <button 
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            همه
          </button>
          <button 
            className={`filter-pill ${filter === 'images' ? 'active' : ''}`}
            onClick={() => setFilter('images')}
          >
            تصاویر
          </button>
          <button 
            className={`filter-pill ${filter === 'videos' ? 'active' : ''}`}
            onClick={() => setFilter('videos')}
          >
            ویدیوها
          </button>
          <button 
            className={`filter-pill ${filter === 'edited' ? 'active' : ''}`}
            onClick={() => setFilter('edited')}
          >
            ویرایش شده
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="posts-container">
        {filteredPosts.length > 0 ? (
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Filter size={48} />
            <h3>هیچ پستی یافت نشد</h3>
            <p>فیلترها را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;