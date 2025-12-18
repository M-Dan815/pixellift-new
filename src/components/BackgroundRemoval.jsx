import React, { useState, useEffect, useMemo } from 'react';
import { Download, Layers, AlertCircle, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const BackgroundRemoval = ({
  selectedImages = [], // Global selected images
  scrapedImages = [],
  optimizedImages = [],
  processedImages = [],
  setScrapedImages = () => {},
  setSelectedImages = () => {},
  setProcessedImages = () => {},
  platform = '',
  whiteBackground = false,
  setWhiteBackground = () => {},
  processing = false,
  setProcessing = () => {},
  toggleSelectAll = () => {},
  clearSelections = () => {},
  addLog
}) => {
  const [error, setError] = useState('');
  const [selectedProcessedImages, setSelectedProcessedImages] = useState([]);
  
  // Local selection state for this component
  const [localSelectedImages, setLocalSelectedImages] = useState([]);
  console.log(optimizedImages)
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

  // Calculate total available images
  const totalAvailableImages = allAvailableImages.length;

  const log = (message, type = 'info') => {
    if (typeof addLog === 'function') {
      addLog(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  };

  const downloadProcessedImages = async () => {
    if (selectedProcessedImages.length === 0) {
      log("⚠️ No processed images selected for download.", "warning");
      return;
    }

    try {
      log(`⬇️ Preparing to download ${selectedProcessedImages.length} processed images...`, "info");

      const filesToDownload = selectedProcessedImages.map((id) => {
        const img = processedImages.find((img) => img.id === id);
        return { url: img.url, filename: img.fileName };
      });
      const user_id = JSON.parse(localStorage.getItem("user")).id;

      // Try ZIP download
      const response = await fetch("https://pythonbackend-production-ab5d.up.railway.app/api/scrapers/download-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user_id,
          files: filesToDownload,
          platform: platform.toLowerCase() || "background-removal",
        }),
      });

      if (!response.ok) throw new Error("ZIP download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${platform || "processed"}-images-${new Date().toISOString().slice(0, 10)}.zip`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      log("✅ ZIP file download started!", "success");
    } catch (err) {
      log("⚠️ ZIP failed, falling back to individual downloads", "warning", { err });

      selectedProcessedImages.forEach((id) => {
        const img = processedImages.find((img) => img.id === id);
        if (img) {
          const link = document.createElement("a");
          link.href = img.url;
          link.download = img.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });

      log("✅ Individual downloads started!", "success");
    }
  };

  const validateImageUrl = (url, type = 'processed', retries = 2) => {
    return new Promise((resolve) => {
      const attemptValidation = (attempt) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          log(`✅ Validated ${type} image URL: ${url} (Attempt ${attempt + 1})`, 'info');
          resolve(true);
        };
        img.onerror = () => {
          if (attempt < retries) {
            log(`⚠️ Retrying ${type} image URL: ${url} (Attempt ${attempt + 1} of ${retries})`, 'warning');
            setTimeout(() => attemptValidation(attempt + 1), 2000);
          } else {
            log(`⚠️ Error validating ${type} image URL: ${url}. Image failed to load after ${retries} attempts.`, 'warning');
            resolve(false);
          }
        };
        img.src = url + '?t=' + new Date().getTime();
        setTimeout(() => {
          if (img.complete) return;
          if (attempt < retries) {
            log(`⚠️ Retrying ${type} image URL: ${url} due to timeout (Attempt ${attempt + 1} of ${retries})`, 'warning');
            setTimeout(() => attemptValidation(attempt + 1), 2000);
          } else {
            log(`⚠️ Timeout validating ${type} image URL: ${url} after ${retries} attempts.`, 'warning');
            resolve(false);
          }
        }, 20000);
      };
      attemptValidation(0);
    });
  };

  const processBackgroundRemoval = async () => {
    if (combinedSelectedImages.length === 0) {
      setError('No images selected for background removal.');
      log('⚠️ No images selected for background removal.', 'warning');
      return;
    }

    setProcessing(true);
    setError('');
    log('ℹ️ Starting background removal process...', 'info');

    try {
      // Get URLs from combined selections
      const imageUrls = combinedSelectedImages.map(img => img.url).filter(url => url);
      
      log(`🔎 Selected image URLs: ${JSON.stringify(imageUrls)}`, 'info');

      if (imageUrls.length === 0) {
        throw new Error('No valid images found for selected IDs.');
      }

      log(`✅ Resolved input URLs: ${JSON.stringify(imageUrls)}`, 'info');

      // Validate inputs
      let user_id = JSON.parse(localStorage.getItem("user")).id;

      // Send to API
      const payload = {
        user_id: user_id,
        image_urls: imageUrls,
        add_white_bg: whiteBackground,
      };

      log(`ℹ️ Sending background removal request for ${imageUrls.length} images`, 'info');
      log(`📤 API request payload: ${JSON.stringify(payload)}`, 'info');

      const apiResponse = await fetch('https://pythonbackend-production-ab5d.up.railway.app/api/background/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      log(`📥 API Response Status: ${apiResponse.status}`, 'info');

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(`API Error: ${JSON.stringify(errorData)}`);
      }

      const result = await apiResponse.json();
      log(`📥 API Response Body: ${JSON.stringify(result)}`, 'info');

      // Validate processed results
      if (result.successful > 0 && result.results && result.results.length > 0) {
        const processedValidationResults = await Promise.all(
          result.results.map(url => validateImageUrl(url, 'processed'))
        );

        const validProcessedUrls = result.results.filter((_, i) => processedValidationResults[i]);
        log(`🟢 Valid processed URLs: ${JSON.stringify(validProcessedUrls)}`, 'info');
        log(`🔴 Invalid processed URLs: ${JSON.stringify(result.results.filter((_, i) => !processedValidationResults[i]))}`, 'info');

        if (validProcessedUrls.length > 0) {
          // Build pairs: match each processed URL to its original safely
          const newProcessedImages = validProcessedUrls.map((url, i) => {
            const originalUrl = imageUrls[i] || 'unknown-original';
            return {
              id: uuidv4(),
              original: originalUrl,
              url,
              platform,
              taskId: result.task_id || 'unknown',
              fileName: url.split('/').pop() || `no_bg_image_${i}.png`,
            };
          });

          log(`🆕 New processed images: ${JSON.stringify(newProcessedImages)}`, 'info');

          setProcessedImages(prev => {
            const existingIds = new Set(prev.map(img => img.id));
            const uniqueNewImages = newProcessedImages.filter(img => !existingIds.has(img.id));
            const newState = [...prev, ...uniqueNewImages];
            log(`📦 Updated processedImages state: ${JSON.stringify(newState)}`, 'info');
            return newState;
          });

          log(
            `✅ Background removal completed for ${validProcessedUrls.length} images. Task ID: ${result.task_id || 'unknown'}`,
            'success'
          );
        } else {
          log('⚠️ No valid processed images after validation. Check network or CORS.', 'warning');
        }
      } else {
        throw new Error(
          result.failed > 0
            ? `Background removal failed for ${result.failed} images.`
            : 'No valid results returned.'
        );
      }
    } catch (error) {
      console.error('❌ Error processing images:', error);
      setError(`Error processing images: ${error.message}`);
      log(`❌ Error processing images: ${error.message}`, 'error');
    } finally {
      setProcessing(false);
      log('ℹ️ Background removal process completed', 'info');
    }
  };

  const toggleProcessedImage = (id) => {
    setSelectedProcessedImages(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id];
      return newSelection;
    });

    log(`ℹ️ Toggled processed image selection: ${id}`, 'info');
  };

  const toggleSelectAllProcessed = () => {
    if (selectedProcessedImages.length === processedImages.length) {
      setSelectedProcessedImages([]);
      log('ℹ️ Deselected all processed images', 'info');
    } else {
      setSelectedProcessedImages(processedImages.map(img => img.id));
      log('ℹ️ Selected all processed images', 'info');
    }
  };

  const clearProcessedSelections = () => {
    setSelectedProcessedImages([]);
    log('ℹ️ Cleared processed image selections', 'info');
  };

  // Log when rendering processed images
  useEffect(() => {
    if (processedImages.length > 0) {
      log(`ℹ️ Rendering ${processedImages.length} processed images`, 'info');
    } else {
      log('ℹ️ No processed images to render', 'info');
    }
  }, [processedImages]);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            Background Removal
          </h2>
          <p className="text-gray-400 text-sm mt-1">Remove background from selected images</p>
        </div>
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

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center mb-6">
          <AlertCircle className="w-5 h-5 text-red-300 mr-2" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

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
            No images selected. Click on images below to select them for background removal.
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

      {/* Background Removal Controls */}
      <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Removal Settings</h3>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={whiteBackground}
                onChange={() => setWhiteBackground(!whiteBackground)}
              />
              <div className={`block w-10 h-6 rounded-full ${whiteBackground ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${whiteBackground ? 'transform translate-x-4' : ''}`}
              ></div>
            </div>
            <div className="ml-3 text-sm text-gray-300">
              Add White Background
            </div>
          </label>

          <button
            onClick={processBackgroundRemoval}
            disabled={combinedSelectedImages.length === 0 || processing}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              combinedSelectedImages.length === 0 || processing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {processing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Remove Background from ${combinedSelectedImages.length} Image${combinedSelectedImages.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>

      {/* Processed Images Results */}
      {Array.isArray(processedImages) && processedImages.length > 0 && (
        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">
              Processed Images ({processedImages.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAllProcessed}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
              >
                {selectedProcessedImages.length === processedImages.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={clearProcessedSelections}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                disabled={selectedProcessedImages.length === 0}
              >
                Clear
              </button>
              <button
                onClick={downloadProcessedImages}
                disabled={selectedProcessedImages.length === 0}
                className={`px-3 py-1.5 text-sm rounded-lg text-white transition-colors flex items-center gap-1 ${
                  selectedProcessedImages.length === 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                <Download className="w-4 h-4" />
                Download Selected ({selectedProcessedImages.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processedImages.map((img) => (
              <div 
                key={img.id} 
                className={`bg-white/5 p-4 rounded-lg border-2 transition-all ${
                  selectedProcessedImages.includes(img.id)
                    ? 'border-purple-400 shadow-lg shadow-purple-400/20'
                    : 'border-white/10'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProcessedImages.includes(img.id)}
                      onChange={() => toggleProcessedImage(img.id)}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                    />
                    <h4 className="text-sm font-medium text-gray-300 ml-2">
                      {img.fileName}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Original</p>
                    <div className="bg-black/20 rounded-lg p-2 border border-white/10">
                      <img
                        src={img.original}
                        alt="Original"
                        className="w-full h-auto max-h-40 object-contain"
                        crossOrigin="anonymous"
                        onLoad={() => log(`✅ Loaded original image: ${img.original}`, 'info')}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/140x91?text=Original+Failed';
                          log(`❌ Failed to load original image: ${img.original}`, 'error');
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Processed</p>
                    <div className="bg-black/20 rounded-lg p-2 border border-white/10">
                      <img
                        src={img.url}
                        alt="Processed"
                        className="w-full h-auto max-h-40 object-contain"
                        crossOrigin="anonymous"
                        onLoad={() => log(`✅ Loaded processed image: ${img.url}`, 'info')}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/140x91?text=Processed+Failed';
                          log(`❌ Failed to load processed image: ${img.url}`, 'error');
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-400">
                    Task ID: <span className="text-gray-300">{img.taskId}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemoval;