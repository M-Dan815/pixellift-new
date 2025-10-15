import React, { useState } from 'react'
import { Link } from "react-router-dom";

const Services = () => {

  const services = [
    {
      id: 1,
      title: "Background Removal",
      subtitle: "Perfect Product Isolation",
      description: "Isolate your products with crisp, clean edges using advanced AI segmentation. No artifacts, just professional results.",
      features: [
        "remove.bg API integration",
        "Meta's Segment Anything Model (SAM)",
        "U²-Net and MODNet compatibility",
        "RemBG Python library support"
      ],
      gradient: "from-purple-500 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Background Generation",
      subtitle: "Realistic Scene Creation",
      description: "Transform your products with AI-generated studio and lifestyle backgrounds that look professionally shot.",
      features: [
        "Stable Diffusion with ControlNet",
        "DALL·E 3 integration",
        "Midjourney compatibility",
        "Smart compositing with OpenCV"
      ],
      gradient: "from-pink-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Image Optimization",
      subtitle: "Perfect Quality & Performance",
      description: "Enhance lighting, sharpness, and colors while optimizing file sizes for lightning-fast online store performance.",
      features: [
        "GFPGAN sharpness restoration",
        "ESRGAN upscaling technology",
        "AI-powered color correction",
        "Smart compression optimization"
      ],
      gradient: "from-blue-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Automated Workflow",
      subtitle: "Zero-Touch Processing",
      description: "Fully automated process that integrates directly with your store. No manual uploads or downloads required.",
      features: [
        "Shopify Admin API integration",
        "FastAPI backend automation",
        "Node.js workflow support",
        "Make/Zapier compatibility"
      ],
      gradient: "from-purple-600 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      )
    },
    {
      id: 5,
      title: "AI Scene Suggestions",
      subtitle: "Creative Background Ideas",
      description: "Get intelligent, brand-consistent background suggestions automatically generated for your specific products.",
      features: [
        "GPT-4/5 scene prompting",
        "CLIP-powered image ranking",
        "Brand consistency analysis",
        "Creative lifestyle suggestions"
      ],
      gradient: "from-indigo-500 to-blue-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      )
    }
  ]

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 relative">
      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full -ml-20 -mb-20"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Coming Soon!</h3>
                <p className="text-gray-300">We're working hard to bring you API access. Stay tuned for updates!</p>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={togglePopup}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Got it!
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-gray-400">Be the first to know when we launch!</p>
                <div className="mt-3 flex gap-3 justify-center">
                  <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                    <span className="sr-only">Discord</span>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.319 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.95-2.42 2.157-2.42 1.21 0 2.175 1.09 2.157 2.42 0 1.334-.95 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.95-2.42 2.157-2.42 1.21 0 2.175 1.09 2.157 2.42 0 1.334-.947 2.42-2.157 2.42z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden text-white pt-16 sm:pt-20 md:pt-24">
        {/* Base solid background */}
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-700"></div>
        </div>
        
        {/* Readability layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>
        
        <div className="relative z-10 min-h-screen container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-0">
          
          {/* Center Content */}
          <div className="w-full text-center flex flex-col items-center justify-center">
            {/* Main Heading */}
            <h1 className="text-[30px] sm:text-[36px] md:text-[48px] lg:text-[54px] mt-10 font-extrabold leading-tight sm:leading-snug mb-6 sm:mb-8 max-w-4xl">
              POWERFUL{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                AI SERVICES
              </span>
              {" "}FOR<br />
              STUNNING{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                PRODUCT IMAGES
              </span>
            </h1>

            {/* Subtext */}
            <div className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-3xl">
              <p>Transform your product photography with cutting-edge AI technology.</p>
              <p>From background removal to scene generation, we've got everything covered.</p>
              <p>Professional results in seconds, not hours.</p>
            </div>

           

            {/* Service Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl w-full mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  5
                </div>
                <div className="text-gray-300 text-sm">AI Services</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  &lt;3s
                </div>
                <div className="text-gray-300 text-sm">Processing Time</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  99%
                </div>
                <div className="text-gray-300 text-sm">Accuracy Rate</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-300 text-sm">API Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              OUR{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                SERVICES
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
              Comprehensive AI-powered solutions for all your product image enhancement needs
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {services.map((service,) => (
              <div 
                key={service.id}
                className="relative group"
                
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden group-hover:bg-white/15 transition-all duration-500 w-full">
                  
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} rounded-full opacity-10 transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-all duration-700`}></div>
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                    
                    {/* Service Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{service.title}</h3>
                          <p className="text-purple-300 text-lg">{service.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                        {service.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8
                                         uppercase tracking-wide shadow-lg
                                         transform -skew-x-12 transition-all duration-300 hover:scale-105 opacity-80 hover:opacity-100">
                        <span className="inline-block skew-x-12 text-sm">LEARN MORE</span>
                      </button>
                    </div>

                    {/* Visual Element */}
                    <div className="lg:w-80 w-full">
                      <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 h-64 lg:h-80 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all duration-500">
                        {/* Decorative elements */}
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/30 rounded-xl transform rotate-12 group-hover:rotate-45 transition-all duration-700"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/20 rounded-lg transform -rotate-12 group-hover:-rotate-45 transition-all duration-700"></div>
                        
                        {/* Center Icon */}
                        <div className="relative z-10 text-white transform group-hover:scale-110 transition-all duration-300">
                          <div className="w-20 h-20">
                            {service.icon}
                          </div>
                        </div>
                        
                        {/* Number Badge */}
                        <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {service.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              SEAMLESS{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                INTEGRATION
              </span>
            </h3>
            
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Our AI services integrate directly with your existing workflow. 
              No complex setup, no manual processes - just powerful automation that works.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">API First</h4>
                <p className="text-gray-300 text-sm">RESTful APIs for seamless integration with any platform</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Batch Processing</h4>
                <p className="text-gray-300 text-sm">Handle thousands of images simultaneously</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">99.9% Uptime</h4>
                <p className="text-gray-300 text-sm">Enterprise-grade reliability you can depend on</p>
              </div>
            </div>

            <button 
              onClick={togglePopup}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10
                         uppercase tracking-wide shadow-lg
                         transform -skew-x-12 transition-all duration-300 hover:scale-105"
            >
              <span className="inline-block skew-x-12">GET API ACCESS</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services

