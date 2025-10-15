import React from 'react'
import { Link } from "react-router-dom";

const Terms = () => {
  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      subtitle: "Your Agreement to Our Conditions",
      description: "By accessing and using Pixellift's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.",
      points: [
        "Agreement to all terms and conditions upon service usage",
        "Acceptance of our privacy policy and data handling practices",
        "Compliance with all applicable laws and regulations",
        "Responsibility for maintaining account security"
      ],
      gradient: "from-purple-500 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Service Usage",
      subtitle: "Appropriate Use of Our Platform",
      description: "Pixellift grants you a limited, non-exclusive, non-transferable license to use our AI services for legitimate business purposes. Your usage must comply with all applicable laws and respect intellectual property rights.",
      points: [
        "Proper authorization for all uploaded content",
        "Prohibition of illegal or harmful activities",
        "Respect for copyright and intellectual property",
        "Compliance with fair usage policies"
      ],
      gradient: "from-pink-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Intellectual Property",
      subtitle: "Ownership and Rights",
      description: "All intellectual property rights in our services, including but not limited to software, algorithms, and AI models, remain the exclusive property of Pixellift. You retain ownership of your original content while granting us limited rights to process it.",
      points: [
        "Pixellift owns all platform IP and technology",
        "Users retain rights to their original content",
        "Limited license for service processing purposes",
        "Prohibition of reverse engineering or copying"
      ],
      gradient: "from-blue-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Payment Terms",
      subtitle: "Billing and Subscription",
      description: "Our services are offered under various subscription plans. Payments are processed securely and subscriptions renew automatically unless cancelled. We reserve the right to modify pricing with prior notice.",
      points: [
        "Automatic subscription renewals",
        "30-day notice for price changes",
        "No refunds for partial subscription periods",
        "Responsibility for payment information accuracy"
      ],
      gradient: "from-purple-600 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      id: 5,
      title: "Limitation of Liability",
      subtitle: "Understanding Our Responsibilities",
      description: "Pixellift provides services on an 'as-is' basis. We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount paid for services in the preceding six months.",
      points: [
        "No warranty for uninterrupted service",
        "Limitation of indirect damages",
        "Maximum liability cap defined",
        "User responsibility for data backup"
      ],
      gradient: "from-indigo-500 to-blue-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
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
              TERMS &{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                CONDITIONS
              </span>
            </h1>

            {/* Subtext */}
            <div className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-3xl">
              <p>Last Updated: December 1, 2023</p>
              <p>Please read these terms carefully before using our services.</p>
              <p>Your access to and use of Pixellift is conditioned on your acceptance of these terms.</p>
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
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg">Important Legal Notice</h3>
                  <p className="text-gray-300 text-sm">These terms constitute a binding legal agreement between you and Pixellift. By using our services, you agree to be bound by these terms.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              LEGAL{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                TERMS
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
              Comprehensive overview of your rights and responsibilities when using Pixellift services
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
              QUESTIONS ABOUT OUR{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                TERMS?
              </span>
            </h3>
            
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Our legal team is here to help you understand our terms and conditions. 
              Don't hesitate to reach out if you have any questions or concerns.
            </p>

            <Link to="/contact">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10
                                 uppercase tracking-wide shadow-lg
                                 transform -skew-x-12 transition-all duration-300 hover:scale-105">
                <span className="inline-block skew-x-12">CONTACT LEGAL TEAM</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Terms