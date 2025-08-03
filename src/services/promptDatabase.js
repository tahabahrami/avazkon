// Mock prompt database for testing
export const promptDatabase = {
  '111111': {
    id: '111111',
    value: 'a sunny day with retro art pop art theme',
    secret: false,
    private: false,
    cost: 0,
    hasAccess: [],
    creator: 'احمد_هنرمند',
    thumbnail: 'https://picsum.photos/200/200?random=1'
  },
  '222222': {
    id: '222222', 
    value: 'atari console games art theme',
    secret: false,
    private: false,
    cost: 0,
    hasAccess: [],
    creator: 'سارا_گیمر',
    thumbnail: 'https://picsum.photos/200/200?random=2'
  },
  '333333': {
    id: '333333',
    value: '1980 style retro street art',
    secret: true,
    private: true,
    cost: 0,
    hasAccess: ['admin', 'premium_user'],
    creator: 'علی_استریت',
    thumbnail: 'https://picsum.photos/200/200?random=3'
  },
  '444444': {
    id: '444444',
    value: 'light through glass, medium format portrait',
    secret: true,
    private: false,
    cost: 2,
    hasAccess: [],
    creator: 'مریم_عکاس',
    thumbnail: 'https://picsum.photos/200/200?random=4'
  },
  '555555': {
    id: '555555',
    value: 'cyberpunk neon cityscape at night',
    secret: false,
    private: false,
    cost: 0,
    hasAccess: [],
    creator: 'رضا_سایبر',
    thumbnail: 'https://picsum.photos/200/200?random=5'
  },
  '666666': {
    id: '666666',
    value: 'vintage film photography aesthetic',
    secret: true,
    private: false,
    cost: 3,
    hasAccess: [],
    creator: 'فاطمه_ویتیج',
    thumbnail: 'https://picsum.photos/200/200?random=6'
  },
  'ABC123': {
    id: 'ABC123',
    value: 'A majestic mountain landscape with snow-capped peaks',
    secret: false,
    private: false,
    cost: 0,
    hasAccess: [],
    creator: 'کاربر_طبیعت',
    thumbnail: 'https://picsum.photos/200/200?random=7'
  },
  'DEF456': {
    id: 'DEF456',
    value: 'Urban street photography with dramatic lighting',
    secret: false,
    private: false,
    cost: 0,
    hasAccess: [],
    creator: 'عکاس_شهری',
    thumbnail: 'https://picsum.photos/200/200?random=8'
  },
  'GHI789': {
    id: 'GHI789',
    value: 'Cinematic video with dynamic camera movements',
    secret: false,
    private: false,
    cost: 0,
    hasAccess: [],
    creator: 'کارگردان_جوان',
    thumbnail: 'https://picsum.photos/200/200?random=9'
  }
};

// Function to get prompt by ID
export const getPromptById = (id) => {
  return promptDatabase[id] || null;
};

// Function to check if user has access to prompt
export const hasPromptAccess = (promptId, username = 'current_user') => {
  const prompt = getPromptById(promptId);
  if (!prompt) return false;
  
  // If not secret, everyone has access
  if (!prompt.secret) return true;
  
  // If secret and private, check access list
  if (prompt.secret && prompt.private) {
    return prompt.hasAccess.includes(username);
  }
  
  // If secret but not private, access is available with cost
  if (prompt.secret && !prompt.private) {
    return true;
  }
  
  return false;
};

// Function to get all available prompts for suggestions
export const getAvailablePrompts = (username = 'current_user') => {
  return Object.values(promptDatabase).filter(prompt => 
    hasPromptAccess(prompt.id, username)
  );
};