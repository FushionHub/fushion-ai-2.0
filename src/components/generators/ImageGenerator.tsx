import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, Download, RefreshCw, Wand2, Palette, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { fusionAI } from '@/lib/ai-engine';
import { updateUserTokens } from '@/lib/firebase';
import toast from 'react-hot-toast';

const ImageGenerator = () => {
  const { user, updateUserTokens: updateStoreTokens } = useStore();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('512x512');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const styles = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic images' },
    { id: 'artistic', name: 'Artistic', description: 'Artistic and creative' },
    { id: 'anime', name: 'Anime', description: 'Anime/manga style' },
    { id: 'digital', name: 'Digital Art', description: 'Digital artwork' },
    { id: 'oil', name: 'Oil Painting', description: 'Oil painting style' },
    { id: 'watercolor', name: 'Watercolor', description: 'Watercolor painting' },
  ];

  const sizes = [
    { id: '256x256', name: '256×256', tokens: 1 },
    { id: '512x512', name: '512×512', tokens: 2 },
    { id: '1024x1024', name: '1024×1024', tokens: 4 },
    { id: '1920x1080', name: '1920×1080', tokens: 6 },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;

    const selectedSize = sizes.find(s => s.id === size);
    const tokensRequired = selectedSize?.tokens || 2;

    if (user.tokens < tokensRequired) {
      toast.error('Insufficient tokens for this image size');
      return;
    }

    setIsGenerating(true);

    try {
      const [width, height] = size.split('x').map(Number);
      
      const imageData = await fusionAI.generateImage(prompt, {
        style,
        width,
        height,
        quality: 'high',
      });

      setGeneratedImage(imageData);

      // Update tokens
      const newTokens = Math.max(0, user.tokens - tokensRequired);
      updateStoreTokens(newTokens);
      await updateUserTokens(user.uid, newTokens);

      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `fusion-ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded!');
  };

  const handleRefine = async () => {
    if (!generatedImage || !prompt.trim()) return;

    setIsGenerating(true);

    try {
      const refinedImage = await fusionAI.generateImage(
        `${prompt} (refined, enhanced quality)`,
        {
          style,
          width: parseInt(size.split('x')[0]),
          height: parseInt(size.split('x')[1]),
          quality: 'ultra',
          refine: true,
        }
      );

      setGeneratedImage(refinedImage);
      toast.success('Image refined successfully!');
    } catch (error) {
      console.error('Image refinement error:', error);
      toast.error('Failed to refine image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Image Generator</h1>
              <p className="text-gray-400">Create stunning images with AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Available Tokens: <span className="text-yellow-400 font-semibold">{user?.tokens || 0}</span></span>
            <span>•</span>
            <span>Cost: {sizes.find(s => s.id === size)?.tokens || 2} tokens</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Wand2 className="w-4 h-4 inline mr-2" />
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A majestic dragon flying over a mystical forest at sunset..."
                className="w-full h-32 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Palette className="w-4 h-4 inline mr-2" />
                Art Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((styleOption) => (
                  <motion.button
                    key={styleOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStyle(styleOption.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      style === styleOption.id
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{styleOption.name}</div>
                    <div className="text-xs opacity-70">{styleOption.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Image Size
              </label>
              <div className="grid grid-cols-2 gap-3">
                {sizes.map((sizeOption) => (
                  <motion.button
                    key={sizeOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSize(sizeOption.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      size === sizeOption.id
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{sizeOption.name}</div>
                    <div className="text-xs opacity-70">{sizeOption.tokens} tokens</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !user || user.tokens < (sizes.find(s => s.id === size)?.tokens || 2)}
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Image</span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generated Image</h3>
              
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="flex-1 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Download
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRefine}
                      disabled={isGenerating}
                      className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Refine
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your generated image will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Generations */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;