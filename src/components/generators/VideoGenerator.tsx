import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Download, Play, Pause, Upload, Link, FileText, Wand2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { fusionAI } from '@/lib/ai-engine';
import { updateUserTokens } from '@/lib/firebase';
import toast from 'react-hot-toast';

const VideoGenerator = () => {
  const { user, updateUserTokens: updateStoreTokens } = useStore();
  const [activeTab, setActiveTab] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [url, setUrl] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration] = useState(30);
  const [quality, setQuality] = useState('1080p');
  const [style, setStyle] = useState('cinematic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qualities = [
    { id: '720p', name: '720p HD', tokens: 5 },
    { id: '1080p', name: '1080p Full HD', tokens: 10 },
    { id: '4K', name: '4K Ultra HD', tokens: 20 },
  ];

  const styles = [
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-like quality' },
    { id: 'documentary', name: 'Documentary', description: 'Professional documentary style' },
    { id: 'commercial', name: 'Commercial', description: 'Advertisement style' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and artistic' },
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic footage' },
    { id: 'animated', name: 'Animated', description: 'Animation style' },
  ];

  const calculateTokens = () => {
    const baseTokens = qualities.find(q => q.id === quality)?.tokens || 10;
    const durationMultiplier = Math.ceil(duration / 30);
    return baseTokens * durationMultiplier;
  };

  const handleGenerate = async () => {
    if (!user) return;

    let inputContent = '';
    if (activeTab === 'prompt' && !prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    if (activeTab === 'script' && !script.trim()) {
      toast.error('Please enter a script');
      return;
    }
    if (activeTab === 'url' && !url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    const tokensRequired = calculateTokens();
    if (user.tokens < tokensRequired) {
      toast.error('Insufficient tokens for this video generation');
      return;
    }

    setIsGenerating(true);

    try {
      let content = '';
      switch (activeTab) {
        case 'prompt':
          content = prompt;
          break;
        case 'script':
          content = script;
          break;
        case 'url':
          content = `Generate video based on content from: ${url}`;
          break;
      }

      const videoData = await fusionAI.generateVideo(content, {
        duration,
        quality,
        style,
        type: activeTab,
      });

      setGeneratedVideo(videoData);

      // Update tokens
      const newTokens = Math.max(0, user.tokens - tokensRequired);
      updateStoreTokens(newTokens);
      await updateUserTokens(user.uid, newTokens);

      toast.success('Video generated successfully!');
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedVideo) return;

    // Create a download link for the video
    const link = document.createElement('a');
    link.href = generatedVideo.url;
    link.download = `fusion-ai-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Video download started!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload for reference material
      toast.success('Reference file uploaded');
    }
  };

  const tabs = [
    { id: 'prompt', name: 'Text Prompt', icon: Wand2 },
    { id: 'script', name: 'Script', icon: FileText },
    { id: 'url', name: 'URL/Link', icon: Link },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Video Generator</h1>
              <p className="text-gray-400">Create up to 3-hour videos with AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Available Tokens: <span className="text-yellow-400 font-semibold">{user?.tokens || 0}</span></span>
            <span>•</span>
            <span>Cost: {calculateTokens()} tokens</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Input Type Tabs */}
            <div>
              <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Input Content */}
              {activeTab === 'prompt' && (
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video you want to create..."
                  className="w-full h-32 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              )}

              {activeTab === 'script' && (
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter your video script here..."
                  className="w-full h-32 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              )}

              {activeTab === 'url' && (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/content"
                    className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">Or upload reference file:</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-600/50 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept="video/*,image/*,.pdf,.doc,.docx"
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </label>
              <input
                type="range"
                min="10"
                max="10800"
                step="10"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10s</span>
                <span>3 hours</span>
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Quality</label>
              <div className="grid grid-cols-3 gap-3">
                {qualities.map((qualityOption) => (
                  <motion.button
                    key={qualityOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setQuality(qualityOption.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      quality === qualityOption.id
                        ? 'bg-red-600/20 border-red-500 text-red-300'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{qualityOption.name}</div>
                    <div className="text-xs opacity-70">{qualityOption.tokens} tokens/30s</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Style</label>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((styleOption) => (
                  <motion.button
                    key={styleOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStyle(styleOption.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      style === styleOption.id
                        ? 'bg-red-600/20 border-red-500 text-red-300'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{styleOption.name}</div>
                    <div className="text-xs opacity-70">{styleOption.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating || !user || user.tokens < calculateTokens()}
              className="w-full p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Video...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Generate Video</span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generated Video</h3>
              
              {generatedVideo ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <img
                      src={generatedVideo.url}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Duration: {generatedVideo.duration}s</span>
                    <span>Quality: {generatedVideo.quality}</span>
                    <span>Size: {generatedVideo.size}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Video
                  </motion.button>
                </div>
              ) : (
                <div className="aspect-video bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your generated video will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video History */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Videos</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <div className="w-16 h-10 bg-gray-600 rounded flex items-center justify-center">
                      <Video className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Video {i}</p>
                      <p className="text-xs text-gray-400">Generated 2 hours ago</p>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </button>
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

export default VideoGenerator;