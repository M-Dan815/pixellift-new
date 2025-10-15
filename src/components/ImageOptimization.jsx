import React, { useState, useMemo, useCallback } from 'react';
import { Download, X, AlertCircle, Check, Eye } from 'lucide-react';
import axios from 'axios';

const ImageOptimization = ({
  scrapedImages = [],
  optimizedImages = [],
  processedImages = [],
  selectedImages = [], // Global selected images
  optimizationOptions,
  setOptimizationOptions,
  optimizing,
  setOptimizing,
  optimizationResults,
  setOptimizationResults,
  setOptimizedImages,
  addLog,
  toggleSelectAll,
  clearSelections,
  platform
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'comparison'
  const [selectedComparison, setSelectedComparison] = useState(null);
  
  // Local selection state for this component
  const [localSelectedImages, setLocalSelectedImages] = useState([]);

  // Combine all available images with proper source tagging
  const allAvailableImages = useMemo(() => {
    const images = [];
    
    // Add scraped images
    // scrapedImages.forEach(img => {
    //   images.push({
    //     ...img,
    //     source: 'scraped',
    //     displayUrl: img.url
    //   });
    // });
    
    // Add optimized images
    optimizedImages.forEach(img => {
      if (img.optimized) {
        images.push({
          ...img,
          source: 'optimized',
          displayUrl: img.optimized,
          name: `optimized-${img.id}`
        });
      }
    });
    
    // Add processed images
    processedImages.forEach(img => {
      images.push({
        ...img,
        source: 'processed',
        displayUrl: img.url
      });
    });
    
    return images;
  }, [scrapedImages, optimizedImages, processedImages]);

  // Get combined selected images (global + local selections)
  const combinedSelectedImages = useMemo(() => {
    const combined = [...selectedImages]; // Start with global selections
    
    // Add local selections that aren't already in global
    localSelectedImages.forEach(localImg => {
      const alreadySelected = combined.some(globalImg => 
        globalImg.id === localImg.id && globalImg.source === localImg.source
      );
      if (!alreadySelected) {
        combined.push(localImg);
      }
    });
    
    return combined;
  }, [selectedImages, localSelectedImages]);

  // Toggle local image selection
  const toggleLocalImageSelection = (image) => {
    setLocalSelectedImages(prev => {
      const isSelected = prev.some(img => 
        img.id === image.id && img.source === image.source
      );
      
      if (isSelected) {
        // Remove from selection
        return prev.filter(img => 
          !(img.id === image.id && img.source === image.source)
        );
      } else {
        // Add to selection
        return [...prev, {
          id: image.id,
          url: image.displayUrl,
          source: image.source,
          name: image.name
        }];
      }
    });
  };

  // Check if an image is selected (either globally or locally)
  const isImageSelected = (image) => {
    return combinedSelectedImages.some(selectedImg => 
      selectedImg.id === image.id && selectedImg.source === image.source
    );
  };

  // Select all available images locally
  const selectAllLocal = () => {
    const allAsSelected = allAvailableImages.map(img => ({
      id: img.id,
      url: img.displayUrl,
      source: img.source,
      name: img.name
    }));
    setLocalSelectedImages(allAsSelected);
  };

  // Clear all local selections
  const clearAllLocal = () => {
    setLocalSelectedImages([]);
  };

  // Toggle optimization option
  const toggleOptimizationOption = (option) => {
    setOptimizationOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Process image optimization - handles multiple images
  const processOptimization = async () => {
    try {
      setOptimizing(true);
      setOptimizationResults({ originals: [], optimized: [] });
  
      // Get all selected images (global + local)
      const imagesToOptimize = combinedSelectedImages;
      
      // Extract URLs
      const imageUrls = imagesToOptimize.map(img => img.url);
      
      addLog(`🔄 Optimizing ${imageUrls.length} image(s)...`, 'info');

      // Prepare payload
      const requestPayload = {
        image_urls: imageUrls,
        upscale: optimizationOptions.upscale,
        denoise: optimizationOptions.denoise,
        enhance_lighting: optimizationOptions.enhance_lighting
      };

      console.log('Optimization request:', requestPayload);

      // Make the API call
      const response = await axios.post(
        'https://hopeful-caring-production.up.railway.app/api/optimization/optimize',
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 300000 // 5 minute timeout
        }
      );

      console.log('Optimization response:', response.data);

      if (response.data && response.data.optimized_urls && response.data.optimized_urls.length > 0) {
        const optimizedUrls = response.data.optimized_urls;

        // Create optimized image objects with before/after pairs
        const newOptimizedImages = optimizedUrls.map((optimizedUrl, index) => ({
          id: `optimized-${Date.now()}-${index}`,
          original: imageUrls[index] || imageUrls[0],
          optimized: optimizedUrl,
          timestamp: new Date().toISOString(),
          options: { ...optimizationOptions }
        }));

        // Store results for comparison view
        setOptimizationResults({
          originals: imageUrls,
          optimized: optimizedUrls,
          pairs: newOptimizedImages
        });

        // Add to optimized images list
        setOptimizedImages(prev => [...prev, ...newOptimizedImages]);

        // Select the first optimized image for comparison
        if (newOptimizedImages.length > 0) {
          setSelectedComparison(newOptimizedImages[0]);
        }

        addLog(
          `✅ Successfully optimized ${optimizedUrls.length} image(s)! ` +
          `(Processed: ${response.data.total_processed}, ` +
          `Successful: ${response.data.total_successful}, ` +
          `Failed: ${response.data.total_failed})`,
          'success'
        );

        // Switch to comparison view
        setViewMode('comparison');
      } else {
        throw new Error('No optimized images returned from the server');
      }
    } catch (error) {
      console.error('Error optimizing image:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      addLog(`❌ Error optimizing image: ${errorMessage}`, 'error');
    } finally {
      setOptimizing(false);
    }
  };

  // Download a single optimized image
  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || `optimized-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      addLog('✅ Image downloaded successfully', 'success');
    } catch (error) {
      addLog(`❌ Error downloading image: ${error.message}`, 'error');
    }
  };

  // Download all optimized images as ZIP
  const downloadAllAsZip = async () => {
    try {
      addLog('🔄 Preparing ZIP download...', 'info');
      
      const optimizedUrls = optimizationResults.optimized || [];
      if (optimizedUrls.length === 0) {
        throw new Error('No optimized images to download');
      }

      addLog('✅ ZIP download started', 'success');
    } catch (error) {
      addLog(`❌ Error creating ZIP: ${error.message}`, 'error');
    }
  };

  // Memoize event handlers
  const handlePreviewClick = useCallback((url) => {
    window.open(url, '_blank');
  }, []);

  // Calculate total available images
  const totalAvailableImages = allAvailableImages.length;

  const renderOptimizationControls = () => (
    <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
      <h3 className="text-lg font-medium text-white mb-4">Optimization Settings</h3>
      <p className="text-gray-400 mb-6">Enhance your product images with AI-powered optimization.</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
          <div>
            <h4 className="font-medium text-white">Upscaling</h4>
            <p className="text-sm text-gray-400">Enhance image resolution up to 4K</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={optimizationOptions.upscale}
              onChange={() => toggleOptimizationOption('upscale')}
            />
            <div className={`block w-11 h-6 rounded-full ${optimizationOptions.upscale ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${optimizationOptions.upscale ? 'transform translate-x-4' : ''}`}></div>
          </label>
        </div>

        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
          <div>
            <h4 className="font-medium text-white">Noise Reduction</h4>
            <p className="text-sm text-gray-400">Reduce image noise and artifacts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={optimizationOptions.denoise}
              onChange={() => toggleOptimizationOption('denoise')}
            />
            <div className={`block w-11 h-6 rounded-full ${optimizationOptions.denoise ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${optimizationOptions.denoise ? 'transform translate-x-4' : ''}`}></div>
          </label>
        </div>

        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
          <div>
            <h4 className="font-medium text-white">Lighting Enhancement</h4>
            <p className="text-sm text-gray-400">Improve brightness and contrast</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={optimizationOptions.enhance_lighting}
              onChange={() => toggleOptimizationOption('enhance_lighting')}
            />
            <div className={`block w-11 h-6 rounded-full ${optimizationOptions.enhance_lighting ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${optimizationOptions.enhance_lighting ? 'transform translate-x-4' : ''}`}></div>
          </label>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={processOptimization}
          disabled={combinedSelectedImages.length === 0 || optimizing}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            combinedSelectedImages.length === 0 || optimizing
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {optimizing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Optimizing {combinedSelectedImages.length} image(s)...
            </span>
          ) : (
            <span>Optimize {combinedSelectedImages.length} Selected Image(s)</span>
          )}
        </button>
      </div>
    </div>
  );

  const renderComparisonView = () => {
    if (!optimizationResults.pairs || optimizationResults.pairs.length === 0) {
      return null;
    }

    const currentPair = selectedComparison || optimizationResults.pairs[0];

    return (
      <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Optimization Results</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Show Grid
            </button>
            {optimizationResults.pairs.length > 1 && (
              <button
                onClick={downloadAllAsZip}
                className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Download All
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail selector for multiple images */}
        {optimizationResults.pairs.length > 1 && (
          <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
            {optimizationResults.pairs.map((pair, index) => (
              <button
                key={pair.id}
                onClick={() => setSelectedComparison(pair)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedComparison?.id === pair.id
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={pair.optimized}
                  alt={`Optimized ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Original</h4>
            <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10">
              <img
                src={currentPair.original}
                alt="Original"
                className="w-full h-auto max-h-80 object-contain mx-auto"
                onError={(e) => {
                  console.error('Failed to load original image:', currentPair.original);
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Load+Failed';
                }}
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Optimized</h4>
            <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10 relative">
              <img
                src={currentPair.optimized}
                alt="Optimized"
                className="w-full h-auto max-h-80 object-contain mx-auto"
                onError={(e) => {
                  console.error('Failed to load optimized image:', currentPair.optimized);
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Load+Failed';
                }}
              />
            </div>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => downloadImage(currentPair.optimized, `optimized-${Date.now()}.png`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentPair.optimized);
                  addLog('✅ Optimized image URL copied to clipboard', 'success');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy URL
              </button>
            </div>
          </div>
        </div>

        {/* Optimization Details */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Optimization Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Upscaling</p>
              <p className="text-sm font-medium text-white">
                {currentPair.options.upscale ? '✅ Enabled' : '❌ Disabled'}
              </p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Noise Reduction</p>
              <p className="text-sm font-medium text-white">
                {currentPair.options.denoise ? '✅ Enabled' : '❌ Disabled'}
              </p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Lighting Enhancement</p>
              <p className="text-sm font-medium text-white">
                {currentPair.options.enhance_lighting ? '✅ Enabled' : '❌ Disabled'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGridView = () => {
    if (!optimizationResults.pairs || optimizationResults.pairs.length === 0) {
      return null;
    }

    return (
      <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            All Optimized Images ({optimizationResults.pairs.length})
          </h3>
          <button
            onClick={() => setViewMode('comparison')}
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Show Comparison
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {optimizationResults.pairs.map((pair, index) => (
            <div key={pair.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-white/10">
              <div className="aspect-square bg-black/20">
                <img
                  src={pair.optimized}
                  alt={`Optimized ${index + 1}`}
                  className="w-full h-full object-contain"
                  onClick={() => {
                    setSelectedComparison(pair);
                    setViewMode('comparison');
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="p-3 space-y-2">
                <button
                  onClick={() => downloadImage(pair.optimized, `optimized-${index + 1}.png`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      {/* Header + actions */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Image Optimization</h3>
        <div className="flex space-x-2">
          <button
            onClick={selectAllLocal}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            disabled={totalAvailableImages === 0}
          >
            Select All Available
          </button>
          <button
            onClick={clearAllLocal}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            disabled={localSelectedImages.length === 0}
          >
            Clear Available
          </button>
        </div>
      </div>

      {/* Selected Images */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-white mb-2">
          Selected Images ({combinedSelectedImages.length})
        </h4>
        {combinedSelectedImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {combinedSelectedImages.map((image, index) => (
              <div
                key={`${image.source}-${image.id}-${index}`}
                className="relative rounded-lg overflow-hidden border border-white/10 bg-black/20"
              >
                <img
                  src={image.url}
                  alt={`${image.source} image`}
                  className="w-full h-24 sm:h-32 object-contain"
                  crossOrigin="anonymous"
                  onError={(e) =>
                    (e.target.src =
                      'https://via.placeholder.com/140x91?text=Load+Failed')
                  }
                />
                <div className="absolute top-1 right-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    image.source === 'scraped' ? 'bg-blue-500/80' :
                    image.source === 'optimized' ? 'bg-green-500/80' :
                    'bg-purple-500/80'
                  } text-white`}>
                    {image.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center text-gray-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            No images selected. Click on images below to select them for optimization.
          </div>
        )}
      </div>

      {/* All Available Images */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-white mb-4">
          Available Images ({totalAvailableImages}) - Click to Select
        </h4>
        
        {/* Scraped Images */}
        {/* {scrapedImages.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-blue-300 mb-2">
              Scraped Images ({scrapedImages.length})
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {scrapedImages.map((image) => {
                const imageWithSource = { ...image, source: 'scraped', displayUrl: image.url };
                const isSelected = isImageSelected(imageWithSource);
                return (
                  <div
                    key={`scraped-${image.id}`}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-400 shadow-lg shadow-blue-400/20' 
                        : 'border-white/10 hover:border-blue-300'
                    } bg-black/20`}
                    onClick={() => toggleLocalImageSelection(imageWithSource)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-24 sm:h-32 object-contain"
                      crossOrigin="anonymous"
                      onError={(e) =>
                        (e.target.src =
                          'https://via.placeholder.com/140x91?text=Load+Failed')
                      }
                    />
                    <div className="absolute top-1 right-1">
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/80 text-white">
                        scraped
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 left-1">
                        <Check className="w-5 h-5 text-white bg-blue-500 rounded-full p-1" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )} */}

        {/* Optimized Images */}
        {optimizedImages.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-green-300 mb-2">
              Optimized Images ({optimizedImages.length})
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {optimizedImages.map((image) => {
                if (image.optimized) {
                  const imageWithSource = { ...image, source: 'optimized', displayUrl: image.optimized, name: `optimized-${image.id}` };
                  const isSelected = isImageSelected(imageWithSource);
                  return (
                    <div
                      key={`optimized-${image.id}`}
                      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-green-400 shadow-lg shadow-green-400/20' 
                          : 'border-white/10 hover:border-green-300'
                      } bg-black/20`}
                      onClick={() => toggleLocalImageSelection(imageWithSource)}
                    >
                      <img
                        src={image.optimized}
                        alt={`optimized-${image.id}`}
                        className="w-full h-24 sm:h-32 object-contain"
                        crossOrigin="anonymous"
                        onError={(e) =>
                          (e.target.src =
                            'https://via.placeholder.com/140x91?text=Load+Failed')
                        }
                      />
                      <div className="absolute top-1 right-1">
                        <span className="text-xs px-2 py-1 rounded bg-green-500/80 text-white">
                          optimized
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 left-1">
                          <Check className="w-5 h-5 text-white bg-green-500 rounded-full p-1" />
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Processed Images */}
        {processedImages.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-purple-300 mb-2">
              Processed Images ({processedImages.length})
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {processedImages.map((image) => {
                const imageWithSource = { ...image, source: 'processed', displayUrl: image.url };
                const isSelected = isImageSelected(imageWithSource);
                return (
                  <div
                    key={`processed-${image.id}`}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-purple-400 shadow-lg shadow-purple-400/20' 
                        : 'border-white/10 hover:border-purple-300'
                    } bg-black/20`}
                    onClick={() => toggleLocalImageSelection(imageWithSource)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-24 sm:h-32 object-contain"
                      crossOrigin="anonymous"
                      onError={(e) =>
                        (e.target.src =
                          'https://via.placeholder.com/140x91?text=Load+Failed')
                      }
                    />
                    <div className="absolute top-1 right-1">
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/80 text-white">
                        processed
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 left-1">
                        <Check className="w-5 h-5 text-white bg-purple-500 rounded-full p-1" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {totalAvailableImages === 0 && (
          <div className="flex items-center text-gray-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            No images available. Please scrape or process images first.
          </div>
        )}
      </div>

      {/* Optimization Settings and Results */}
      <div className="space-y-6">
        {renderOptimizationControls()}
        {viewMode === 'comparison' && renderComparisonView()}
        {viewMode === 'grid' && renderGridView()}
      </div>
    </div>
  );
};

export default ImageOptimization;