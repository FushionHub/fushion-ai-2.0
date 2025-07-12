import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Image, 
  Video, 
  Mic, 
  Code, 
  FileText, 
  Camera,
  Sparkles,
  ArrowRight,
  Check,
  Star
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Chat',
      description: 'Sophisticated conversations that surpass GPT-4o and Gemini',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Image,
      title: 'Unlimited Image Generation',
      description: 'Create stunning visuals with multiple art styles',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Video,
      title: '3-Hour Video Creation',
      description: 'Generate up to 3 hours of 4K quality videos',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Mic,
      title: 'Unlimited Audio Generation',
      description: 'Text-to-speech with multiple voice varieties',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Code,
      title: 'Advanced Code Generation',
      description: 'Multi-language code generation and conversion',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: Camera,
      title: 'Face Swap Technology',
      description: 'Advanced face changing and enhancement',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: FileText,
      title: 'Document Processing',
      description: 'Generate and read PDF, DOCX, and more',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Viral Content Creator',
      description: 'Generate compelling ads and marketing content',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: { USD: 9.99, NGN: 4500 },
      tokens: 1000,
      features: [
        'Basic AI Chat',
        'Image Generation (10/day)',
        'Text-to-Speech (Basic)',
        'Document Generation',
        'Email Support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: { USD: 29.99, NGN: 13500 },
      tokens: 5000,
      features: [
        'Advanced AI Chat',
        'Unlimited Image Generation',
        'Video Generation (5 min)',
        'Advanced Text-to-Speech',
        'Code Generation',
        'Face Swap Technology',
        'Priority Support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: { USD: 99.99, NGN: 45000 },
      tokens: 25000,
      features: [
        'Enterprise AI Features',
        'Unlimited Everything',
        'Video Generation (3 hours)',
        'Advanced Voice Cloning',
        'Custom AI Models',
        'API Access',
        'White-label Options',
        '24/7 Support'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <Zap className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Fusion AI 2.0
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              AI Model Like No Other
            </p>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the most sophisticated AI platform with local processing capabilities 
              that surpass GPT-4o, DeepSeek, and Gemini. Create unlimited content with 
              enterprise-grade security and privacy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Start Creating Now
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800/50 border border-gray-700/50 text-white rounded-2xl font-semibold text-lg hover:bg-gray-700/50 transition-all duration-200"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to create, generate, and innovate with AI - all processed locally 
              for maximum privacy and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Flexible pricing for individuals, teams, and enterprises. All plans include 
              unlimited access to our advanced AI features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
                    : 'border-gray-700/50 hover:border-gray-600/50'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">${plan.price.USD}</span>
                    <span className="text-gray-400 ml-2">/ ₦{plan.price.NGN}</span>
                  </div>
                  <p className="text-gray-400">{plan.tokens.toLocaleString()} tokens included</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : 'bg-gray-700/50 text-white hover:bg-gray-600/50 border border-gray-600/50'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Join thousands of creators, developers, and businesses who are already using 
              Fusion AI 2.0 to transform their workflows and unlock new possibilities.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;