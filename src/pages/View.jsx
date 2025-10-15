import React, { useState, useEffect } from 'react';
import { 
  Upload, Download, Settings, Play, Pause, RotateCcw, Trash2, Eye, EyeOff, 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Grid3X3, List, Filter, Search, 
  X, Check, AlertCircle, Clock, Zap, Sparkles, Image as ImageIcon, Layers, 
  Palette, Wand2, Save, Share2, RefreshCcw, FileImage, FolderOpen, Star, Heart, 
  Tag, Calendar, User, BarChart3, TrendingUp, Activity, Home, Building, 
  ShoppingCart, Package, Cpu, HardDrive, Menu, Monitor, Smartphone, Tablet, 
  Camera, Mic, Lock, Shield, Globe, MapPin, Sun, Moon, Cloud, ChevronDown, ExternalLink
} from 'lucide-react';
import { redirect, useNavigate, useSearchParams } from 'react-router-dom';
import AmazonScraper from '../components/AmazonScraper';
import EbayScraper from '../components/EbayScraper';
import ShopifyScraper from '../components/ShopifyScraper';
import BackgroundRemoval from '../components/BackgroundRemoval';
import ImageOptimization from '../components/ImageOptimization';
import BackgroundGeneration from '../components/BackgroundGeneration';
import Report from '../components/Report';
import axios from 'axios';
import SceneSuggestions from '../components/SceneSuggestions';
import SettingsComp from '../components/Settings';

// Helper functions for localStorage
const loadFromSessionStorage = (key, defaultValue = null) => {
  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToSessionStorage = (key, value) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const clearSessionStorage = (keys) => {
  try {
    keys.forEach(key => window.sessionStorage.removeItem(key));
  } catch (error) {
    console.error(`Error clearing localStorage:, error`);
  }
};

const View = () => {
  const [searchParams] = useSearchParams();
  
  // Load state from localStorage on initial render
  const [selectedImages, setSelectedImages] = useState(() => 
    loadFromSessionStorage('pixelLift_selectedImages', [])
  );
  const [activeSection, setActiveSection] = useState(() => 
    loadFromSessionStorage('pixelLift_activeSection', 'gallery')
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => 
    loadFromSessionStorage('pixelLift_sidebarCollapsed', false)
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState(() => 
    loadFromSessionStorage('pixelLift_logs', [])
  );
  const [scrapedImages, setScrapedImages] = useState(() => 
    loadFromSessionStorage('pixelLift_scrapedImages', [])
  );
  const [validScrapedImages, setValidScrapedImages] = useState(() => 
    loadFromSessionStorage('pixelLift_validScrapedImages', [])
  );
  const [maxProducts, setMaxProducts] = useState(() => 
    loadFromSessionStorage('pixelLift_maxProducts', 30)
  );
  const [scrapingComplete, setScrapingComplete] = useState(false);
  const [platform, setPlatform] = useState(() => 
    loadFromSessionStorage('pixelLift_platform', 'amazon')
  );
  const [whiteBackground, setWhiteBackground] = useState(() => 
    loadFromSessionStorage('pixelLift_whiteBackground', false)
  );
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState(() => 
    loadFromSessionStorage('pixelLift_processedImages', [])
  );

  // Plan state - Load from localStorage with fallback
  const [userPlan, setUserPlan] = useState('Free');

  const [optimizationOptions, setOptimizationOptions] = useState(() => 
    loadFromSessionStorage('pixelLift_optimizationOptions', {
      upscale: true,
      denoise: true
    })
  );
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedImages, setOptimizedImages] = useState(() => 
    loadFromSessionStorage('pixelLift_optimizedImages', [])
  );
  const [optimizationResults, setOptimizationResults] = useState(() => 
    loadFromSessionStorage('pixelLift_optimizationResults', {
      original: null,
      optimized: null
    })
  );
  const [backgroundPrompt, setBackgroundPrompt] = useState(() => 
    loadFromSessionStorage('pixelLift_backgroundPrompt', 'studio product background, soft light')
  );
  const [negativePrompt, setNegativePrompt] = useState(() => 
    loadFromSessionStorage('pixelLift_negativePrompt', '')
  );
  const [numImages, setNumImages] = useState(() => 
    loadFromSessionStorage('pixelLift_numImages', 1)
  );
  const [imageSize, setImageSize] = useState(() => 
    loadFromSessionStorage('pixelLift_imageSize', '1024x1024')
  );
  const [quality, setQuality] = useState(() => 
    loadFromSessionStorage('pixelLift_quality', 'hd')
  );
  const [generatingBackground, setGeneratingBackground] = useState(false);
  const [validGeneratedBackgrounds, setValidGeneratedBackgrounds] = useState(() => 
    loadFromSessionStorage('pixelLift_validGeneratedBackgrounds', [])
  );
  const [brandStyle, setBrandStyle] = useState(() => 
    loadFromSessionStorage('pixelLift_brandStyle', '')
  );
  const [numPrompts, setNumPrompts] = useState(() => 
    loadFromSessionStorage('pixelLift_numPrompts', 5)
  );
  const [suggesting, setSuggesting] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState(() => 
    loadFromSessionStorage('pixelLift_generatedPrompts', [])
  );
  const [selectedPrompt, setSelectedPrompt] = useState(() => 
    loadFromSessionStorage('pixelLift_selectedPrompt', '')
  );
  
  const navigate = useNavigate();
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToSessionStorage('pixelLift_selectedImages', selectedImages);
  }, [selectedImages]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_activeSection', activeSection);
  }, [activeSection]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_sidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_logs', logs);
  }, [logs]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_scrapedImages', scrapedImages);
  }, [scrapedImages]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_validScrapedImages', validScrapedImages);
  }, [validScrapedImages]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_maxProducts', maxProducts);
  }, [maxProducts]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_platform', platform);
  }, [platform]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_whiteBackground', whiteBackground);
  }, [whiteBackground]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_processedImages', processedImages);
  }, [processedImages]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_optimizationOptions', optimizationOptions);
  }, [optimizationOptions]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_optimizedImages', optimizedImages);
  }, [optimizedImages]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_optimizationResults', optimizationResults);
  }, [optimizationResults]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_backgroundPrompt', backgroundPrompt);
  }, [backgroundPrompt]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_negativePrompt', negativePrompt);
  }, [negativePrompt]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_numImages', numImages);
  }, [numImages]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_imageSize', imageSize);
  }, [imageSize]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_quality', quality);
  }, [quality]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_validGeneratedBackgrounds', validGeneratedBackgrounds);
  }, [validGeneratedBackgrounds]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_brandStyle', brandStyle);
  }, [brandStyle]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_numPrompts', numPrompts);
  }, [numPrompts]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_generatedPrompts', generatedPrompts);
  }, [generatedPrompts]);
  
  useEffect(() => {
    saveToSessionStorage('pixelLift_selectedPrompt', selectedPrompt);
  }, [selectedPrompt]);
  
  // Function to clear all saved data
  const clearAllData = () => {
    const keys = [
      'pixelLift_selectedImages',
      'pixelLift_activeSection',
      'pixelLift_sidebarCollapsed',
      'pixelLift_logs',
      'pixelLift_scrapedImages',
      'pixelLift_validScrapedImages',
      'pixelLift_maxProducts',
      'pixelLift_platform',
      'pixelLift_whiteBackground',
      'pixelLift_processedImages',
      'pixelLift_optimizationOptions',
      'pixelLift_optimizedImages',
      'pixelLift_optimizationResults',
      'pixelLift_backgroundPrompt',
      'pixelLift_negativePrompt',
      'pixelLift_numImages',
      'pixelLift_imageSize',
      'pixelLift_quality',
      'pixelLift_validGeneratedBackgrounds',
      'pixelLift_brandStyle',
      'pixelLift_numPrompts',
      'pixelLift_generatedPrompts',
      'pixelLift_selectedPrompt'
    ];
    
    clearSessionStorage(keys);
    
    // Reset state to defaults
    setSelectedImages([]);
    setActiveSection('gallery');
    setSidebarCollapsed(false);
    setLogs([]);
    setScrapedImages([]);
    setValidScrapedImages([]);
    setMaxProducts(30);
    setPlatform('amazon');
    setWhiteBackground(false);
    setProcessedImages([]);
    setOptimizationOptions({
      upscale: true,
      denoise: true
    });
    setOptimizedImages([]);
    setOptimizationResults({
      original: null,
      optimized: null
    });
    setBackgroundPrompt('studio product background, soft light');
    setNegativePrompt('');
    setNumImages(1);
    setImageSize('1024x1024');
    setQuality('hd');
    setValidGeneratedBackgrounds([]);
    setBrandStyle('');
    setNumPrompts(5);
    setGeneratedPrompts([]);
    setSelectedPrompt('');
    
    addLog('✅ All saved data has been cleared', 'success');
  };

  // Load user plan from localStorage (safe with fallback)
  useEffect(() => {
    try {
      const storedUser = localStorage?.getItem?.('user');
      console.log('Loaded user from localStorage:', storedUser);
      if (!!storedUser) {
        const userData = JSON.parse(storedUser);
        setUserPlan(userData?.planName || 'Free');
      }
      else {
        // navigate('/auth');
      }
    } catch (error) {
      console.warn('Could not load user plan from localStorage:', error);
      setUserPlan('Free');
    }
  }, []);

  // Auto-detect platform from URL if available
  useEffect(() => {
    const urlPlatform = searchParams.get('platform');
    if (urlPlatform && ['amazon', 'ebay', 'shopify'].includes(urlPlatform)) {
      setPlatform(urlPlatform);
    }
  }, [searchParams]);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add log message
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const startScraping = async () => {
    if (!url) {
      addLog('❌ Please enter a valid URL', 'error');
      return;
    }

    // Validate maxProducts is a positive number
    const maxToScrape = Math.max(0, Math.min(parseInt(maxProducts) || 30, 100)); // Limit to 100 max products
    if (maxToScrape !== maxProducts) {
      setMaxProducts(maxToScrape);
      addLog(`ℹ Adjusted max products to ${maxToScrape} (1-100)`, 'info');
    }

    setIsScraping(true);
    setScrapingComplete(false);
    setProgress(0);
    setScrapedImages([]);
    setLogs([]);

    addLog(`🚀 Starting ${platform} image scraper...`, 'info');
    addLog(`🌐 Scraping URL: ${url}`, 'info');
    addLog(`📊 Max products to scrape: ${maxToScrape}`, 'info');
    
    if (url.includes('/products/')) {
      addLog(`ℹ Single product URL detected, collecting all available images`, 'info');
    } else {
      addLog(`ℹ Collection/category URL detected, collecting up to ${maxToScrape} products`, 'info');
    }

    let progressInterval;
    try {
      addLog('📡 Connecting to server...', 'info');
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 2, 90); // Slower progress for better UX
          if (newProgress % 10 === 0) {
            addLog(`Processing... ${newProgress}% complete`, 'info');
          }
          return newProgress;
        });
      }, 1000);

      const response = await axios.post(
        `http://127.0.0.1:8000/api/scrapers/${platform}`,
        { 
          url, 
          max_products: maxToScrape,
          headless: true // Ensure headless mode is enabled
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 300000 // 5 minutes
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      const { total_products, total_images, image_urls, unique_images, errors } = response.data;

      if (image_urls && image_urls.length > 0) {
        const formattedImages = image_urls.map((imgUrl, index) => ({
          id: `${platform}-${Date.now()}-${index}`,
          url: imgUrl,
          name: `scraped-${platform}-${index}.jpg`,
          timestamp: new Date().toISOString(),
          selected: false
        }));

        setScrapedImages(formattedImages);
        setValidScrapedImages(formattedImages);
        setSelectedImages([]);
        
        addLog(`✅ Successfully scraped ${image_urls.length} ${platform} images`, 'success');
        if (total_products) addLog(`📦 Found ${total_products} products with ${total_images} total images`, 'info');
        if (unique_images) addLog(`✨ Extracted ${unique_images} unique high-quality images`, 'info');
        
        // Show summary of the scraping operation
        if (image_urls.length > 0) {
          addLog(`🏁 Scraping completed: ${image_urls.length} images from ${total_products || 1} products`, 'success');
        }
      } else {
        addLog('⚠ No images found on the page', 'warning');
      }

      if (errors && errors.length > 0) {
        errors.forEach(error => addLog(`⚠ ${error}`, 'warning'));
      }

      setScrapingComplete(true);
    } catch (error) {
      clearInterval(progressInterval);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error occurred';
      addLog(`❌ Error: ${errorMsg} `, 'error');
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => addLog(`  - ${err.msg}`, 'error'));
      }
    } finally {
      setIsScraping(false);
    }
  };

  // Toggle select all/none images
  const toggleSelectAll = () => {
    if (selectedImages.length === scrapedImages.length) {
      setSelectedImages([]);   // Deselect all
    } else {
      setSelectedImages(scrapedImages.map(img => {return {id: img.id, url: img.url, source: 'scraped'}}));  // Select all
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedImages([]);
    setValidScrapedImages(prev => prev.map(img => ({ ...img, selected: false })));
  };

  // Plan-based feature access helpers
  const isFree = userPlan === 'Free';
  const isStarter = userPlan === 'Starter';
  const isGrowth = userPlan === 'Growth';
  const isEnterprise = userPlan === 'Enterprise';

  // Define what sidebar items are available for each plan
  const planSidebarMap = {
    'Free': ['gallery', 'background-removal', 'settings'],
    'Starter': ['gallery', 'background-removal', 'settings'],
    'Growth': ['gallery', 'background-removal', 'optimization', 'background-generation', 'settings'],
    'Enterprise': ['gallery', 'background-removal', 'optimization', "scene-suggestions", 'background-generation',  'report', 'settings']
  };

  const allowedSidebarItems = planSidebarMap[userPlan] || planSidebarMap['Free'];

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'gallery', label: 'Image Gallery', icon: ImageIcon },
    { id: 'background-removal', label: 'Background Removal', icon: Layers },
    { id: 'optimization', label: 'Image Optimization', icon: Wand2 },
    { id: 'scene-suggestions', label: 'Scene Suggestions', icon: Sparkles },
    { id: 'background-generation', label: 'Background Gen', icon: Palette },
    // { id: 'report', label: 'Task Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Filter sidebar items based on user plan
  const visibleSidebarItems = sidebarItems.filter(item => allowedSidebarItems.includes(item.id));

  // Render the appropriate scraper component based on platform
  const renderScraper = () => {
    const commonProps = {
      platform: platform,
      url: url,
      setUrl: setUrl,
      isScraping: isScraping,
      setIsScraping: setIsScraping,
      scrapedImages: scrapedImages,
      setScrapedImages: setScrapedImages,
      selectedImages: selectedImages,
      setSelectedImages: setSelectedImages,
      progress: progress,
      setProgress: setProgress,
      logs: logs,
      setLogs: setLogs,
      addLog: addLog,
      scrapingComplete: scrapingComplete,
      setScrapingComplete: setScrapingComplete,
      maxProducts: maxProducts,
      setMaxProducts: (value) => {
        // Ensure the value is a number between 1 and 100
        const numValue = Math.max(1, Math.min(parseInt(value) || 1, 100));
        setMaxProducts(numValue);
      },
      toggleSelectAll: toggleSelectAll,
      clearSelections: clearSelections,
      startScraping: startScraping // Pass the startScraping function
    };

    switch (platform) {
      case 'amazon':
        return <AmazonScraper {...commonProps} />;
      case 'ebay':
        return <EbayScraper {...commonProps} />;
      case 'shopify':
        return <ShopifyScraper {...commonProps} />;
      default:
        return <div>Unsupported platform</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c54] via-[#2d2e7a] to-[#4c0d73] pt-16 sm:pt-20">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-4 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-16 sm:top-20 left-0 right-0 z-30 bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PixelLift
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-gray-900 text-gray-200 border border-white/20 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isScraping}
              >
                <option value="amazon" className="bg-gray-900 text-gray-200">
                  Amazon
                </option>
                <option value="ebay" className="bg-gray-900 text-gray-200">
                  eBay
                </option>
                <option value="shopify" className="bg-gray-900 text-gray-200">
                  Shopify
                </option>
              </select>
              <div className="text-xs text-gray-300">
                <span className="text-white font-semibold">{userPlan}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Left Sidebar */}
        <div className={`
          lg:relative lg:translate-x-0
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarCollapsed ? 'w-20' : 'w-64 sm:w-72 lg:w-64'}
          bg-white/10 backdrop-blur-sm border-r border-white/20 flex flex-col
          lg:min-h-0 min-h-screen lg:mt-0 mt-16 sm:mt-20
        `}>
          {/* Desktop Header */}
          <div className="hidden lg:block p-4 sm:p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    PixelLift
                  </h1>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PixelLift
              </h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <nav className="space-y-1 sm:space-y-2">
              {visibleSidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {(!sidebarCollapsed || mobileMenuOpen) && (
                      <span className="font-medium text-sm sm:text-base">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:mt-0 mt-16 sm:mt-20 lg:pt-0 pt-16 max-w-full overflow-hidden">
          {/* Desktop Platform Selector */}
          <div className="hidden lg:flex items-center justify-between gap-2 p-4 sm:p-6 pb-0">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-gray-900 text-gray-200 border border-white/20 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isScraping}
            >
              <option value="amazon" className="bg-gray-900 text-gray-200">
                Amazon
              </option>
              <option value="ebay" className="bg-gray-900 text-gray-200">
                eBay
              </option>
              <option value="shopify" className="bg-gray-900 text-gray-200">
                Shopify
              </option>
            </select>
            <div className="text-sm text-gray-300">
              Plan: <span className="text-white font-semibold ml-1">{userPlan}</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            {activeSection === 'gallery' && (
              <div className="space-y-4 sm:space-y-6">
                {renderScraper()}
                
                {/* Background Removal - Available for Starter, Growth, Enterprise */}
                {(isFree || isStarter || isGrowth || isEnterprise) && (
                  <BackgroundRemoval
                    selectedImages={selectedImages}
                    scrapedImages={scrapedImages}
                    setScrapedImages={setValidScrapedImages}
                    setSelectedImages={setSelectedImages}
                    platform={platform}
                    whiteBackground={whiteBackground}
                    setWhiteBackground={setWhiteBackground}
                    processing={processing}
                    setProcessing={setProcessing}
                    processedImages={processedImages}
                    setProcessedImages={setProcessedImages}
                    toggleSelectAll={toggleSelectAll}
                    clearSelections={clearSelections}
                    optimizedImages={optimizedImages}
                  />
                )}
                
                {/* Image Optimization - Available for Starter, Growth, Enterprise */}
                {(isStarter || isGrowth || isEnterprise) && (
                  <ImageOptimization
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    scrapedImages={scrapedImages}
                    processedImages={processedImages}
                    optimizationOptions={optimizationOptions}
                    setOptimizationOptions={setOptimizationOptions}
                    optimizing={optimizing}
                    setOptimizing={setOptimizing}
                    optimizationResults={optimizationResults}
                    setOptimizationResults={setOptimizationResults}
                    optimizedImages={optimizedImages}
                    setOptimizedImages={setOptimizedImages}
                    addLog={addLog}
                    toggleSelectAll={toggleSelectAll}
                    clearSelections={clearSelections}
                    platform={platform}
                  />
                )}
                
                {(isEnterprise) && (<SceneSuggestions
                    selectedImages={selectedImages}
                    scrapedImages={validScrapedImages}
                    optimizedImages={[...(optimizedImages || []), ...(processedImages || [])]} 
                    brandStyle={brandStyle}
                    setBrandStyle={setBrandStyle}
                    backgroundPrompt={backgroundPrompt}
                    setBackgroundPrompt={setBackgroundPrompt}
                    numPrompts={numPrompts}
                    setNumPrompts={setNumPrompts}
                    suggesting={suggesting}
                    setSuggesting={setSuggesting}
                    generatedPrompts={generatedPrompts}
                    setGeneratedPrompts={setGeneratedPrompts}
                    selectedPrompt={selectedPrompt}
                    setSelectedPrompt={setSelectedPrompt}
                    addLog={addLog}
                    toggleSelectAll={toggleSelectAll}
                    clearSelections={clearSelections}
                    platform={platform}
                  />)}

                {/* Background Generation - Available for Growth, Enterprise */}
                {(isGrowth || isEnterprise) && (
                  <BackgroundGeneration
                    selectedImages={selectedImages}
                    processedImages={processedImages}
                    optimizedImages={[...(optimizedImages || []), ...(processedImages || [])]} // Combined like Scene Suggestions
                    scrapedImages={validScrapedImages} // Use validScrapedImages consistently
                    backgroundPrompt={backgroundPrompt}
                    setBackgroundPrompt={setBackgroundPrompt}
                    negativePrompt={negativePrompt}
                    setNegativePrompt={setNegativePrompt}
                    numImages={numImages}
                    setNumImages={setNumImages}
                    imageSize={imageSize}
                    setImageSize={setImageSize}
                    quality={quality}
                    setQuality={setQuality}
                    generatingBackground={generatingBackground}
                    setGeneratingBackground={setGeneratingBackground}
                    generatedBackgrounds={validGeneratedBackgrounds}
                    setGeneratedBackgrounds={setValidGeneratedBackgrounds}
                    addLog={addLog}
                    toggleSelectAll={toggleSelectAll}
                    clearSelections={clearSelections}
                    platform={platform}
                  />
                )}
              </div>
            )}

            {/* Individual section views - only render if user has access */}
            {activeSection === 'background-removal' && (isStarter || isGrowth || isEnterprise) && (
              <div className="space-y-4 sm:space-y-6">
                <BackgroundRemoval
                  selectedImages={selectedImages}
                  scrapedImages={validScrapedImages}
                  setScrapedImages={setValidScrapedImages}
                  setSelectedImages={setSelectedImages}
                  platform={platform}
                  whiteBackground={whiteBackground}
                  setWhiteBackground={setWhiteBackground}
                  processing={processing}
                  setProcessing={setProcessing}
                  processedImages={processedImages}
                  setProcessedImages={setProcessedImages}
                  toggleSelectAll={toggleSelectAll}
                  clearSelections={clearSelections}
                  optimizedImages={optimizedImages}
                />
              </div>
            )}

            {activeSection === 'optimization' && (isStarter || isGrowth || isEnterprise) && (
              <div className="space-y-4 sm:space-y-6">
                <ImageOptimization
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  scrapedImages={validScrapedImages}
                  processedImages={processedImages}
                  optimizationOptions={optimizationOptions}
                  setOptimizationOptions={setOptimizationOptions}
                  optimizing={optimizing}
                  setOptimizing={setOptimizing}
                  optimizationResults={optimizationResults}
                  setOptimizationResults={setOptimizationResults}
                  optimizedImages={optimizedImages}
                  setOptimizedImages={setOptimizedImages}
                  addLog={addLog}
                  toggleSelectAll={toggleSelectAll}
                  clearSelections={clearSelections}
                  platform={platform}
                />
              </div>
            )}

            {activeSection === 'scene-suggestions' && (
              <div className="space-y-4 sm:space-y-6">
                <SceneSuggestions
                  selectedImages={selectedImages}
                  scrapedImages={validScrapedImages}
                  optimizedImages={optimizedImages}
                  brandStyle={brandStyle}
                  setBrandStyle={setBrandStyle}
                  backgroundPrompt={backgroundPrompt}
                  setBackgroundPrompt={setBackgroundPrompt}
                  numPrompts={numPrompts}
                  setNumPrompts={setNumPrompts}
                  suggesting={suggesting}
                  setSuggesting={setSuggesting}
                  generatedPrompts={generatedPrompts}
                  setGeneratedPrompts={setGeneratedPrompts}
                  selectedPrompt={selectedPrompt}
                  setSelectedPrompt={setSelectedPrompt}
                  addLog={addLog}
                  toggleSelectAll={toggleSelectAll}
                  clearSelections={clearSelections}
                  platform={platform}
                />
              </div>
            )}

            {activeSection === 'background-generation' && (isGrowth || isEnterprise) && (
              <div className="space-y-4 sm:space-y-6">
                <BackgroundGeneration
                  selectedImages={selectedImages}
                  processedImages={processedImages}
                  optimizedImages={[...(optimizedImages || []), ...(processedImages || [])]} // Combined like Scene Suggestions
                  scrapedImages={validScrapedImages}
                  backgroundPrompt={backgroundPrompt}
                  setBackgroundPrompt={setBackgroundPrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  numImages={numImages}
                  setNumImages={setNumImages}
                  imageSize={imageSize}
                  setImageSize={setImageSize}
                  quality={quality}
                  setQuality={setQuality}
                  generatingBackground={generatingBackground}
                  setGeneratingBackground={setGeneratingBackground}
                  generatedBackgrounds={validGeneratedBackgrounds}
                  setGeneratedBackgrounds={setValidGeneratedBackgrounds}
                  addLog={addLog}
                  toggleSelectAll={toggleSelectAll}
                  clearSelections={clearSelections}
                  platform={platform}
                />
              </div>
            )}

            {activeSection === 'settings' && (
              <SettingsComp addLog={addLog} />
            )}

            {/* Logs */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-medium text-white">Logs</h3>
                <button
                  onClick={() => setLogs([])}
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Clear Logs
                </button>
              </div>
              <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div 
                    key={`${log.timestamp}-${index}`}
                    className={`text-xs sm:text-sm p-2 sm:p-3 rounded ${
                      log.type === 'error'
                        ? 'bg-red-500/20 text-red-300'
                        : log.type === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : log.type === 'success'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-gray-800/50 text-gray-300'
                    }`}
                  >
                    <span className="hidden sm:inline">
                      [{new Date(log.timestamp).toLocaleString()}] 
                    </span>
                    <span className="sm:hidden">
                      [{new Date(log.timestamp).toLocaleTimeString()}] 
                    </span>
                    {log.message}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-xs sm:text-sm p-3 text-gray-400 text-center">
                    No logs yet. Start scraping to see activity.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;