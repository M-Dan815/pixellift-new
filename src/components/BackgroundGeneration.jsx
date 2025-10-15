import React, { useState, useMemo, useCallback } from 'react';
import { Eye, Download, AlertCircle, Check } from 'lucide-react';
import axios from 'axios';

const BackgroundGeneration = ({
  backgroundPrompt,
  setBackgroundPrompt,
  negativePrompt,
  setNegativePrompt,
  numImages,
  setNumImages,
  imageSize,
  setImageSize,
  quality,
  setQuality,
  generatingBackground,
  setGeneratingBackground,
  generatedBackgrounds,
  setGeneratedBackgrounds,
  addLog,
  scrapedImages = [],
  optimizedImages = [],
  processedImages = [],
  selectedImages = [], // Global selected images from scrapers
  toggleSelectAll,
  clearSelections,
  platform
}) => {
  // Local selection state for this component
  const [localSelectedImages, setLocalSelectedImages] = useState([]);

  // Combine all available images with proper source tagging
  const allAvailableImages = useMemo(() => {
    const images = [];
    
    // Add scraped images
    scrapedImages.forEach(img => {
      images.push({
        ...img,
        source: 'scraped',
        displayUrl: img.url
      });
    });
    
    // Add optimized images (only if they have optimized URL)
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

  // Generate background images
  const generateBackgrounds = async () => {
    if (!backgroundPrompt.trim()) {
      addLog('⚠️ Please enter a valid prompt', 'warning');
      return;
    }

    // Get URLs from all selected images (global + local)
    const selectedUrls = combinedSelectedImages.map(img => img.url).filter(url => url);
    
    if (selectedUrls.length === 0) {
      addLog('⚠️ Please select at least one image for background generation', 'warning');
      return;
    }

    setGeneratingBackground(true);

    try {
      const requestPayload = {
        prompt: backgroundPrompt,
        negative_prompt: negativePrompt || null,
        num_images: numImages,
        size: imageSize,
        quality: quality,
        image_url: selectedUrls,
      };

      addLog(`🎨 Generating backgrounds for ${selectedUrls.length} selected images...`, 'info');
      const response = await axios.post(
        'https://hopeful-caring-production.up.railway.app/api/generation/generate',
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 300000,
        }
      );

      addLog(`ℹ️ API response: ${JSON.stringify(response.data)}`, 'info');

      if (response.data && Array.isArray(response.data.images)) {
        const newBackgrounds = response.data.images.map((imgUrl, index) => ({
          id: `bg-${Date.now()}-${index}`,
          url: imgUrl,
          name: `generated-bg-${index + 1}.jpg`,
          timestamp: new Date().toISOString(),
        }));

        setGeneratedBackgrounds(newBackgrounds);
        addLog(`✅ Generated ${newBackgrounds.length} background images!`, 'success');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error generating backgrounds:', error);
      if (error.response) {
        addLog(`❌ Server error: ${error.response.data.detail || error.message}`, 'error');
      } else if (error.request) {
        addLog('❌ No response from server. Ensure backend is running.', 'error');
      } else {
        addLog(`❌ Error generating backgrounds: ${error.message}`, 'error');
      }
    } finally {
      setGeneratingBackground(false);
    }
  };

  // Memoize event handlers
  const handlePreviewClick = useCallback((url) => {
    window.open(url, '_blank');
  }, []);

  const handleDownloadClick = useCallback((url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Calculate total available images
  const totalAvailableImages = allAvailableImages.length;

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      {/* Header + actions */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Background Generation</h3>
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
            No images selected. Click on images below to select them for background generation.
          </div>
        )}
      </div>

      {/* All Available Images */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-white mb-4">
          Available Images ({totalAvailableImages}) - Click to Select
        </h4>
        
        {/* Scraped Images */}
        {scrapedImages.length > 0 && (
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
        )}

        {/* Optimized Images */}
        {optimizedImages.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-green-300 mb-2">
              Optimized Images ({optimizedImages.filter(img => img.optimized).length})
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {optimizedImages.map((image) => {
                if (image.optimized) {
                  const imageWithSource = { 
                    ...image, 
                    source: 'optimized', 
                    displayUrl: image.optimized, 
                    name: `optimized-${image.id}` 
                  };
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
            No images available. Please scrape, optimize, or process images first.
          </div>
        )}
      </div>

      {/* Generation Controls */}
      <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Generation Settings</h3>
          <p className="text-gray-400 mb-6">Configure your background generation settings.</p>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prompt
          </label>
          <textarea
            value={backgroundPrompt}
            onChange={(e) => setBackgroundPrompt(e.target.value)}
            rows={3}
            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Describe the background you want to generate..."
          />
        </div>

        {/* Negative Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Negative Prompt (Optional)
          </label>
          <input
            type="text"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Things to avoid in the background..."
          />
        </div>

        {/* Generate Button */}
        <div className="mt-8">
          <button
            onClick={generateBackgrounds}
            disabled={generatingBackground || combinedSelectedImages.length === 0}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              generatingBackground || combinedSelectedImages.length === 0
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {generatingBackground ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating backgrounds...
              </span>
            ) : (
              `Generate Backgrounds for ${combinedSelectedImages.length} Selected Image${combinedSelectedImages.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>

      {/* Generated Backgrounds */}
      {generatedBackgrounds.length > 0 && (
        <div className="mt-8 bg-gray-900/50 p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">
              Generated Backgrounds ({generatedBackgrounds.length})
            </h3>
            <button
              onClick={() => {
                generatedBackgrounds.forEach(bg => {
                  handleDownloadClick(bg.url, bg.name);
                });
                addLog('✅ Downloading all generated backgrounds', 'success');
              }}
              className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Download All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {generatedBackgrounds.map((bg) => (
              <div key={bg.id} className="relative group">
                <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={bg.url}
                    alt={bg.name}
                    className="w-full h-48 object-cover"
                    crossOrigin="anonymous"
                    onError={(e) =>
                      (e.target.src =
                        'https://via.placeholder.com/400x300?text=Image+Load+Failed')
                    }
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    onClick={() => handlePreviewClick(bg.url)}
                    title="Preview"
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </button>
                  <button
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    onClick={() => handleDownloadClick(bg.url, bg.name)}
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate">{bg.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundGeneration;