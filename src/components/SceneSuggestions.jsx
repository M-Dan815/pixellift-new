import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const SceneSuggestions = ({
  selectedImages,
  scrapedImages,
  optimizedImages,
  brandStyle,
  setBrandStyle,
  numPrompts,
  setNumPrompts,
  suggesting,
  setSuggesting,
  generatedPrompts,
  setGeneratedPrompts,
  selectedPrompt,
  setSelectedPrompt,
  addLog,
  toggleSelectAll,
  clearSelections,
  platform,
  backgroundPrompt,
  setBackgroundPrompt
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle generating prompts
  const handleGeneratePrompts = async () => {
    if (!selectedImage) {
      addLog('❌ Please select an image to generate scene suggestions.', 'error');
      return;
    }

    setSuggesting(true);
    addLog(`🚀 Generating ${numPrompts} scene suggestions for image: ${selectedImage.name}`, 'info');

    try {
      const response = await axios.post(
        'https://hopeful-caring-production.up.railway.app/api/suggest/prompts',
        {
          image_url: selectedImage.url?selectedImage.url:selectedImage.optimized,
          num_prompts: numPrompts,
          brand_style: brandStyle || undefined
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000 // 30 seconds
        }
      );

      const { prompts, image_url, message } = response.data;
      setGeneratedPrompts(prompts);
      addLog(`✅ ${message} (${prompts.length} prompts generated for ${image_url})`, 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error occurred';
      addLog(`❌ Failed to generate scene suggestions: ${errorMsg}`, 'error');
    } finally {
      setSuggesting(false);
    }
  };

  // Handle prompt selection
  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    addLog(`✅ Selected prompt: "${prompt}"`, 'success');
    setBackgroundPrompt(prompt); 
  };

  // Handle image selection
  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setGeneratedPrompts([]); // Clear previous prompts
    setSelectedPrompt(''); // Clear selected prompt
    addLog(`ℹ️ Selected image for scene suggestions: ${image.name}`, 'info');
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-medium text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        Scene Suggestions
      </h2>

      {/* Image Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Product Image
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 max-h-64 overflow-y-auto">
          {(optimizedImages.length > 0 ? optimizedImages : scrapedImages).map((image) => (
            <div
              key={image.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                selectedImage?.id === image.id ? 'border-purple-500' : 'border-transparent'
              } hover:border-purple-300 transition-all duration-200`}
              onClick={() => handleImageSelect(image)}
            >
              <img
                src={image.url? image.url : image.optimized}
                alt={image.name}
                className="w-full h-24 sm:h-32 object-contain bg-gray-800/50"
              />
              {selectedImage?.id === image.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-500/30">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        {optimizedImages.length === 0 && scrapedImages.length === 0 && (
          <p className="text-sm text-gray-400">No images available. Scrape or optimize images first.</p>
        )}
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Brand Style (Optional)
          </label>
          <input
            type="text"
            value={brandStyle}
            onChange={(e) => setBrandStyle(e.target.value)}
            placeholder="e.g., cozy rustic, modern minimalist"
            className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={suggesting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Suggestions (1-10)
          </label>
          <input
            type="number"
            value={numPrompts}
            onChange={(e) => setNumPrompts(Math.max(1, Math.min(10, parseInt(e.target.value) || 5)))}
            min="1"
            max="10"
            className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={suggesting}
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGeneratePrompts}
        disabled={suggesting || !selectedImage}
        className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
          suggesting || !selectedImage
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        {suggesting ? 'Generating...' : 'Generate Scene Suggestions'}
      </button>

      {/* Generated Prompts */}
      {generatedPrompts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Suggested Backgrounds</h3>
          <div className="space-y-2">
            {generatedPrompts.map((prompt, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPrompt === prompt
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
                onClick={() => handleSelectPrompt(prompt)}
              >
                <span className="text-sm">{`${index + 1}. ${prompt}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error or No Prompts */}
      {generatedPrompts.length === 0 && !suggesting && selectedImage && (
        <div className="mt-4 flex items-center gap-2 text-yellow-300">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">No suggestions generated. Click "Generate Scene Suggestions" to start.</p>
        </div>
      )}
    </div>
  );
};

export default SceneSuggestions;
