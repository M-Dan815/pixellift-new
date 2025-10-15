import React from 'react'
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Data Collection",
      subtitle: "What Information We Gather",
      description: "Pixellift collects necessary information to provide and improve our services. We are transparent about what data we collect and how it's used to enhance your experience with our AI image processing platform.",
      points: [
        "Account registration information",
        "Uploaded product images for processing",
        "Service usage metrics and analytics",
        "Technical data including IP addresses and device information"
      ],
      gradient: "from-purple-500 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Data Usage",
      subtitle: "How We Use Your Information",
      description: "Your data helps us provide, maintain, and improve our services. We use collected information to process your images, personalize your experience, and ensure the security of our platform.",
      points: [
        "AI model training and improvement",
        "Service customization and personalization",
        "Platform security and fraud prevention",
        "Customer support and communication"
      ],
      gradient: "from-pink-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Data Protection",
      subtitle: "Keeping Your Information Secure",
      description: "We implement industry-standard security measures to protect your data. Our security protocols include encryption, access controls, and regular security audits to ensure your information remains safe.",
      points: [
        "End-to-end encryption for all data transfers",
        "Secure storage with AES-256 encryption",
        "Regular security audits and vulnerability testing",
        "Strict access controls and authentication protocols"
      ],
      gradient: "from-blue-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Data Sharing",
      subtitle: "Third-Party Disclosure",
      description: "We do not sell your personal data. We only share information with trusted third parties when necessary for service provision, legal compliance, or with your explicit consent.",
      points: [
        "Service providers essential for platform operation",
        "Legal compliance with government requests",
        "Business transfers during mergers or acquisitions",
        "Anonymized data for research and analytics"
      ],
      gradient: "from-purple-600 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      )
    },
    {
      id: 5,
      title: "Your Rights",
      subtitle: "Control Over Your Data",
      description: "You have rights regarding your personal data, including access, correction, deletion, and data portability. We provide tools and processes to exercise these rights easily.",
      points: [
        "Right to access and download your data",
        "Right to correct inaccurate information",
        "Right to delete your account and data",
        "Right to opt-out of marketing communications"
      ],
      gradient: "from-indigo-500 to-blue-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
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
              PRIVACY{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                POLICY
              </span>
            </h1>

            {/* Subtext */}
            <div className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-3xl">
              <p>Last Updated: December 1, 2023</p>
              <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
              <p>We are committed to transparency and giving you control over your personal data.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16 w-full sm:w-auto">
              <Link to="/services" className="w-full sm:w-auto">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 
                                    uppercase tracking-wide shadow-lg 
                                    transform -skew-x-12 transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto">
                  <span className="inline-block skew-x-12">BACK TO SERVICES</span>
                </button>
              </Link>
            </div>

            {/* Important Notice */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-4xl w-full mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg">Your Privacy Matters</h3>
                  <p className="text-gray-300 text-sm">We are GDPR compliant and adhere to global privacy standards. Your trust is our priority, and we handle your data with the utmost care and security.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              DATA{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                PROTECTION
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
              Comprehensive overview of how we collect, use, and protect your personal information
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {sections.map((section) => (
              <div 
                key={section.id}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden group-hover:bg-white/15 transition-all duration-500 w-full">
                  
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.gradient} rounded-full opacity-10 transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-all duration-700`}></div>
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                    
                    {/* Section Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                          {section.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{section.title}</h3>
                          <p className="text-purple-300 text-lg">{section.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                        {section.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {section.points.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <span className="text-gray-300 text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
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
                            {section.icon}
                          </div>
                        </div>
                        
                        {/* Number Badge */}
                        <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {section.id}
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

      {/* Contact Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              PRIVACY{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                QUESTIONS?
              </span>
            </h3>
            
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Our privacy team is here to address any concerns about your data. 
              Contact us for more information about our privacy practices or to exercise your data rights.
            </p>

            <Link to="/contact">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10
                                 uppercase tracking-wide shadow-lg
                                 transform -skew-x-12 transition-all duration-300 hover:scale-105">
                <span className="inline-block skew-x-12">CONTACT PRIVACY TEAM</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy  