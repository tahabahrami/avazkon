import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pixie_user');
    const savedAuth = localStorage.getItem('pixie_auth');
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication - in real app, this would be an API call
        if (email && password) {
          const mockUser = {
            id: '1',
            name: 'کاربر پیکسی',
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('کاربر پیکسی')}&background=6366f1&color=fff&size=128`,
            joinDate: new Date().toISOString(),
            subscription: 'premium',
            usage: {
              imagesCreated: 42,
              videosCreated: 8,
              imagesEdited: 156,
              totalCredits: 1000,
              usedCredits: 234
            }
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('pixie_user', JSON.stringify(mockUser));
      localStorage.setItem('pixie_auth', 'true');
          
          setIsLoading(false);
          resolve(mockUser);
        } else {
          setIsLoading(false);
          reject(new Error('ایمیل یا رمز عبور نادرست است'));
        }
      }, 1500); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pixie_user');
      localStorage.removeItem('pixie_auth');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('pixie_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;