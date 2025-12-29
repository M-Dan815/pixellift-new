import React, {useEffect, useRef, useState, useLayoutEffect} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import HeroImage from "../../public/images/Hero.png";
import Feature1 from "../../public/images/Feature1.png";
import Feature2 from "../../public/images/Feature2.png";
import Feature3 from "../../public/images/Feature4.jpg";
import Result from "../../public/images/Result.png";
import Testimonials from "../components/Testimonials";
import {Link} from "react-router-dom";
import video from "../../public/video.mp4";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Optimized Image Component with smoother loading
const OptimizedImage = ({src, alt, className, style}) => {
	const [imageState, setImageState] = useState("loading");
	const imageRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const img = new Image();

		img.onload = () => {
			requestAnimationFrame(() => {
				setImageState("loaded");
			});
		};

		img.onerror = () => {
			setImageState("error");
		};

		img.src = src;

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, [src]);

	// Set initial state with GSAP to avoid conflicts
	useLayoutEffect(() => {
		if (imageRef.current) {
			gsap.set(imageRef.current, {
				opacity: 0,
				scale: 1.03,
				filter: "blur(8px)",
			});
		}
	}, []);

	// Animate when image is loaded
	useEffect(() => {
		if (imageState === "loaded" && imageRef.current) {
			gsap.to(imageRef.current, {
				opacity: 1,
				scale: 1,
				filter: "blur(0px)",
				duration: 1.2,
				ease: "power2.out",
				clearProps: "filter",
			});
		}
	}, [imageState]);

	return (
		<div ref={containerRef} className="absolute inset-0 overflow-hidden">
			{/* Animated gradient placeholder */}
			<div
				className="absolute inset-0"
				style={{
					opacity: imageState === "loaded" ? 0 : 1,
					transition: "opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
					<div
						className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
						style={{
							animation: "shimmer 2s infinite",
						}}
					/>
				</div>
			</div>

			{/* Actual image */}
			<div
				ref={imageRef}
				className="absolute inset-0 bg-no-repeat will-change-transform"
				style={{
					backgroundImage: imageState !== "loading" ? `url(${src})` : "none",
					backgroundSize: "cover",
					backgroundPosition:
						typeof window !== "undefined" && window.innerWidth < 768
							? "center"
							: "center right",
					transformOrigin: "center center",
					...style,
				}}
			/>

			<style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
		</div>
	);
};

const Home = () => {
	const heroRef = useRef(null);
	const headingRef = useRef(null);
	const subtextRef = useRef(null);
	const buttonsRef = useRef(null);
	const statsRef = useRef(null);

	// For Video section
	const videoSectionRef = useRef(null);
	const videoContainerRef = useRef(null);
	const videoPlayerRef = useRef(null);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);

	// For Results section
	const resultsSectionRef = useRef(null);
	const resultsImageRef = useRef(null);
	const resultsContentRef = useRef(null);

	// For Features section
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const featureCardsRef = useRef([]);
	const autoPlayRef = useRef(null);

	// Features data array
	const featuresData = [
		{
			id: 1,
			image: Feature1,
			alt: "Feature1",
			buttonText: "AI BACKGROUND GENERATION",
		},
		{
			id: 2,
			image: Feature2,
			alt: "Feature2",
			buttonText: "BACKGROUND REMOVAL",
		},
		{
			id: 3,
			image: Feature3,
			alt: "Feature3",
			buttonText: "AI IMAGE OPTIMIZATION",
		},
	];

	// Handle window resize
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Get card animation config - SCALE controls size differences now
	const getCardAnimationConfig = (index, activeIndex) => {
		const diff =
			(index - activeIndex + featuresData.length) % featuresData.length;

		if (isMobile) {
			if (diff === 0) {
				// Center card - full size
				return {x: 0, y: -20, scale: 1, opacity: 1, zIndex: 10, rotateY: 0};
			} else if (diff === 1) {
				// Right card
				return {x: 150, y: 0, scale: 0.85, opacity: 0, zIndex: 5, rotateY: 15};
			} else {
				// Left card
				return {
					x: -150,
					y: 0,
					scale: 0.85,
					opacity: 0,
					zIndex: 5,
					rotateY: -15,
				};
			}
		} else {
			if (diff === 0) {
				// Center card - slightly larger via scale
				return {x: 0, y: -30, scale: 1.1, opacity: 1, zIndex: 10, rotateY: 0};
			} else if (diff === 1) {
				// Right card - smaller via scale
				return {
					x: 350,
					y: 0,
					scale: 0.85,
					opacity: 0.7,
					zIndex: 5,
					rotateY: -5,
				};
			} else {
				// Left card - smaller via scale
				return {
					x: -350,
					y: 0,
					scale: 0.85,
					opacity: 0.7,
					zIndex: 5,
					rotateY: 5,
				};
			}
		}
	};

	// Get card base size - SAME SIZE FOR ALL CARDS
	const getCardBaseSize = () => {
		if (isMobile) {
			return {
				width: "85vw",
				height: "300px",
			};
		} else {
			return {
				width: "38vw",
				height: "320px",
			};
		}
	};

	// Animate cards with GSAP
	const animateCards = (newIndex) => {
		if (isAnimating) return;
		setIsAnimating(true);

		const tl = gsap.timeline({
			onComplete: () => {
				setCurrentSlide(newIndex);
				setIsAnimating(false);
			},
		});

		featureCardsRef.current.forEach((card, index) => {
			if (!card) return;

			const config = getCardAnimationConfig(index, newIndex);

			tl.to(
				card,
				{
					x: config.x,
					y: config.y,
					scale: config.scale,
					opacity: config.opacity,
					zIndex: config.zIndex,
					rotateY: config.rotateY,
					duration: 0.8,
					ease: "power3.inOut",
				},
				0
			);
		});
	};

	// Initial card positions
	useLayoutEffect(() => {
		featureCardsRef.current.forEach((card, index) => {
			if (!card) return;

			const config = getCardAnimationConfig(index, currentSlide);

			gsap.set(card, {
				x: config.x,
				y: config.y,
				scale: config.scale,
				opacity: config.opacity,
				zIndex: config.zIndex,
				rotateY: config.rotateY,
				transformPerspective: 1000,
				transformOrigin: "center center",
			});
		});
	}, [isMobile]);

	// Auto-slide functionality
	useEffect(() => {
		autoPlayRef.current = setInterval(() => {
			if (!isAnimating) {
				const nextIndex = (currentSlide + 1) % featuresData.length;
				animateCards(nextIndex);
			}
		}, 4000);

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
			}
		};
	}, [currentSlide, isAnimating, featuresData.length]);

	// Handle dot click
	const handleDotClick = (index) => {
		if (index === currentSlide || isAnimating) return;

		if (autoPlayRef.current) {
			clearInterval(autoPlayRef.current);
		}

		animateCards(index);
	};

	// Handle video play
	const handlePlayVideo = () => {
		setIsVideoPlaying(true);
		setTimeout(() => {
			if (videoPlayerRef.current) {
				videoPlayerRef.current.play();
			}
		}, 100);
	};

	// Handle video pause
	const handleVideoClick = () => {
		if (videoPlayerRef.current) {
			if (videoPlayerRef.current.paused) {
				videoPlayerRef.current.play();
			} else {
				videoPlayerRef.current.pause();
			}
		}
	};

	// Animation for Hero section
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(
				[
					headingRef.current,
					subtextRef.current,
					buttonsRef.current,
					statsRef.current,
				],
				{opacity: 0, x: -100}
			);

			gsap.to(
				[
					headingRef.current,
					subtextRef.current,
					buttonsRef.current,
					statsRef.current,
				],
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: heroRef.current,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				}
			);
		}, heroRef);

		return () => ctx.revert();
	}, []);

	// Animation for Video section
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(videoContainerRef.current, {opacity: 0, scale: 0.8});

			gsap.to(videoContainerRef.current, {
				opacity: 1,
				scale: 1,
				duration: 1.2,
				ease: "power2.out",
				scrollTrigger: {
					trigger: videoSectionRef.current,
					start: "top 80%",
					toggleActions: "play none none reverse",
				},
			});
		}, videoSectionRef);

		return () => ctx.revert();
	}, []);

	// Animation for Results section
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(resultsImageRef.current, {opacity: 0, x: -100});
			gsap.set(resultsContentRef.current, {opacity: 0, x: 100});

			gsap.to(resultsImageRef.current, {
				opacity: 1,
				x: 0,
				duration: 0.8,
				ease: "power2.out",
				scrollTrigger: {
					trigger: resultsSectionRef.current,
					start: "top 80%",
					toggleActions: "play none none reverse",
				},
			});

			gsap.to(resultsContentRef.current, {
				opacity: 1,
				x: 0,
				duration: 0.8,
				ease: "power2.out",
				scrollTrigger: {
					trigger: resultsSectionRef.current,
					start: "top 80%",
					toggleActions: "play none none reverse",
				},
			});
		}, resultsSectionRef);

		return () => ctx.revert();
	}, []);

	// Get base card size (same for all cards)
	const cardSize = getCardBaseSize();

	return (
		<div>
			{/* Hero Section */}
			<section
				ref={heroRef}
				className="relative min-h-screen w-full overflow-hidden text-white pt-16 sm:pt-20 md:pt-24"
			>
				<div className="absolute inset-0 bg-[#0A0A0A]"></div>
				<OptimizedImage src={HeroImage} alt="Hero" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#2E1E6B] from-40% sm:from-30% via-[#2E1E6B]/70 sm:via-[#2E1E6B]/60 via-70% sm:via-60% to-transparent"></div>

				<div className="relative z-10 min-h-screen container mx-auto flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-0">
					<div className="w-full ml-2 sm:ml-6 md:ml-10 md:w-1/2 flex flex-col items-start justify-center">
						<h1
							ref={headingRef}
							className="text-[28px] sm:text-[32px] md:text-[42px] lg:text-[46px] font-extrabold leading-tight sm:leading-snug mb-4 sm:mb-6 max-w-xl"
						>
							ENHANCE <br />
							<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
								YOUR PRODUCT
							</span>
							<br />
							IMAGE
						</h1>

						<div
							ref={subtextRef}
							className="text-gray-200 text-sm sm:text-base md:text-base leading-relaxed mb-6 sm:mb-8 max-w-md"
						>
							<p>Turn ordinary photos into eye-catching visuals.</p>
							<p>Showcase your products with clarity and style.</p>
							<p>Let AI make your images market-ready in seconds.</p>
						</div>

						<div
							ref={buttonsRef}
							className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto"
						>
							<Link
								to="/cards"
								className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-2.5 px-6 sm:px-8 
                          uppercase tracking-wide shadow-lg 
                          transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto text-center"
							>
								<span className="inline-block skew-x-[12deg]">TRY NOW</span>
							</Link>

							<Link
								to="/services"
								className="border border-purple-400 text-purple-200 font-bold py-3 sm:py-2.5 px-6 sm:px-8 
                          uppercase tracking-wide 
                          transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 
                          bg-transparent hover:border-purple-300 hover:text-white text-sm md:text-base w-full sm:w-auto text-center"
							>
								<span className="inline-block skew-x-[12deg]">LEARN MORE</span>
							</Link>
						</div>

						<div
							ref={statsRef}
							className="flex mb-8 sm:mb-10 gap-6 sm:gap-8 md:gap-12 justify-center sm:justify-start w-full sm:w-auto"
						>
							<div className="text-center">
								<div className="text-lg sm:text-xl md:text-2xl font-bold">
									300+
								</div>
								<div className="text-xs md:text-sm text-gray-300">
									Unique Style
								</div>
							</div>
							<div className="text-center">
								<div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
									2K+
								</div>
								<div className="text-xs md:text-sm text-gray-300">
									Product Enhanced
								</div>
							</div>
							<div className="text-center">
								<div className="text-lg sm:text-xl md:text-2xl font-bold">
									75+
								</div>
								<div className="text-xs md:text-sm text-gray-300">
									Happy Customer
								</div>
							</div>
						</div>
					</div>

					<div className="hidden md:block w-1/2"></div>
				</div>
			</section>

			{/* Video Demo Section */}
			<section
				ref={videoSectionRef}
				className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1c54] via-[#2d2e7a] to-[#4c0d73] py-12 sm:py-20"
			>
				<div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')]"></div>

				<div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center">
					<h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 tracking-wide">
						WITNESS THE{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
							MAGIC
						</span>
					</h2>
					<p className="text-gray-300 text-lg sm:text-xl text-center mb-10 sm:mb-12 max-w-2xl">
						See how our AI transforms ordinary images into extraordinary visuals
						in seconds
					</p>

					<div
						ref={videoContainerRef}
						className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
					>
						<div className="relative aspect-video w-full bg-black">
							{/* Play Button Cover */}
							{!isVideoPlaying && (
								<div
									className="absolute inset-0 z-20 cursor-pointer group"
									onClick={handlePlayVideo}
								>
									<div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
										<div className="absolute inset-0 opacity-20">
											<div
												className="absolute inset-0"
												style={{
													backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
																	  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
												}}
											/>
										</div>
										<div
											className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
											style={{
												animation: "videoShimmer 3s infinite",
											}}
										/>
									</div>

									<div className="absolute inset-0 flex items-center justify-center">
										<div className="relative">
											<div
												className="absolute inset-0 rounded-full bg-white/20 animate-ping"
												style={{animationDuration: "2s"}}
											></div>
											<div
												className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
														  flex items-center justify-center shadow-2xl
														  transform transition-transform duration-300 group-hover:scale-110"
											>
												<svg
													className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
										</div>
									</div>

									<div className="absolute bottom-6 left-0 right-0 text-center">
										<p className="text-white/80 text-sm sm:text-base font-medium">
											Click to watch the demo
										</p>
									</div>
								</div>
							)}

							{/* Video Player */}
							<video
								ref={videoPlayerRef}
								className={`w-full h-full object-cover transition-opacity duration-500 ${
									isVideoPlaying ? "opacity-100" : "opacity-0"
								}`}
								src={video}
								loop
								playsInline
								onClick={handleVideoClick}
								onPlay={() => setIsVideoPlaying(true)}
								preload="metadata"
							>
								Your browser does not support the video tag.
							</video>

							{isVideoPlaying && (
								<div
									className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
											   opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
								/>
							)}
						</div>
					</div>

					<div className="mt-10 sm:mt-12 text-center">
						<p className="text-gray-300 text-sm sm:text-base mb-6">
							Ready to transform your images?
						</p>
						<Link
							to="/payment"
							className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
                         py-3 px-8 uppercase tracking-wide shadow-lg 
                         transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 inline-block"
						>
							<span className="inline-block skew-x-[12deg]">
								GET STARTED NOW
							</span>
						</Link>
					</div>
				</div>

				<style>{`
					@keyframes videoShimmer {
						0% { transform: translateX(-100%); }
						100% { transform: translateX(100%); }
					}
				`}</style>
			</section>

			{/* Features Section - FIXED ANIMATION */}
			<section className="w-full bg-gradient-to-br from-[#1a1c54] via-[#2d2e7a] to-[#4c0d73] py-12 sm:py-20 flex flex-col items-center overflow-hidden relative min-h-screen">
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

				<div className="relative z-10 mb-12 sm:mb-16 px-4">
					<h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold text-center tracking-wide leading-tight">
						EXPLORE
						<br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
							POWERFUL
						</span>{" "}
						FEATURE
					</h2>
				</div>

				{/* Cards Container */}
				<div
					className="relative w-full max-w-7xl mx-auto mb-12 sm:mb-16"
					style={{
						height: isMobile ? "380px" : "450px",
						perspective: "1000px",
					}}
				>
					{/* Cards - ALL SAME BASE SIZE */}
					<div className="relative h-full flex items-center justify-center">
						{featuresData.map((feature, index) => {
							const isCenter = index === currentSlide;

							return (
								<div
									key={feature.id}
									ref={(el) => (featureCardsRef.current[index] = el)}
									className="absolute left-1/2 -translate-x-1/2 will-change-transform cursor-pointer"
									onClick={() => handleDotClick(index)}
									style={{
										transformStyle: "preserve-3d",
										top: "50%",
										marginTop: isMobile ? "-150px" : "-160px",
									}}
								>
									{/* Card - SAME SIZE FOR ALL */}
									<div
										className="overflow-hidden shadow-2xl relative rounded-xl"
										style={{
											width: cardSize.width,
											height: cardSize.height,
										}}
									>
										<img
											src={feature.image}
											alt={feature.alt}
											className="w-full h-full object-cover object-center"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
									</div>

									{/* Button */}
									{isCenter && (
										<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20">
											<div
												className="bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                                   text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 shadow-lg relative"
												style={{
													clipPath:
														"polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
													minWidth: isMobile ? "160px" : "200px",
													textAlign: "center",
												}}
											>
												{feature.buttonText}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Dot Navigation */}
				<div className="flex justify-center gap-3 mb-10">
					{featuresData.map((_, index) => (
						<button
							key={index}
							disabled={isAnimating}
							className={`h-3 rounded-full transition-all duration-500 cursor-pointer disabled:cursor-not-allowed
                ${
									index === currentSlide
										? "w-10 bg-gradient-to-r from-pink-500 to-purple-500"
										: "w-3 bg-white/40 hover:bg-white/60"
								}`}
							onClick={() => handleDotClick(index)}
							aria-label={`Go to feature ${index + 1}`}
						/>
					))}
				</div>

				{/* Bottom Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10 px-4 w-full sm:w-auto items-center">
					<Link
						to="/services"
						className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 sm:px-8 
                       uppercase tracking-wide shadow-lg 
                       transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
					>
						<span className="inline-block skew-x-[12deg]">VIEW ALL</span>
					</Link>

					<Link
						to="/payment"
						className="border border-purple-400 text-purple-200 font-bold py-3 px-6 sm:px-8 
                       uppercase tracking-wide 
                       transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 
                       bg-transparent hover:border-purple-300 hover:text-white w-full sm:w-auto text-center"
					>
						<span className="inline-block skew-x-[12deg]">TRY NOW</span>
					</Link>
				</div>
			</section>

			{/* Results Section */}
			<section
				ref={resultsSectionRef}
				className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 
                   min-h-screen px-4 sm:px-6 md:px-12 flex items-center 
                   overflow-x-hidden py-12 sm:py-20"
			>
				<div className="max-w-7xl mx-auto w-full">
					<div
						className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl 
                       h-auto md:h-[80vh] p-4 md:p-6 relative overflow-hidden flex items-center"
					>
						<div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16 w-full">
							<div ref={resultsImageRef} className="w-full lg:w-1/2 relative">
								<div className="relative z-10">
									<img
										src={Result}
										alt="VR Experience"
										className="w-full h-56 sm:h-72 md:h-96 lg:h-[480px] 
                               object-cover max-w-sm sm:max-w-md md:max-w-lg 
                               mx-auto lg:mx-0 drop-shadow-2xl rounded-2xl"
									/>
								</div>
							</div>

							<div
								ref={resultsContentRef}
								className="w-full lg:w-1/2 text-white text-center lg:text-left 
                           mt-6 sm:mt-8 lg:mt-0 px-2 sm:px-0"
							>
								<h2
									className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
                             mb-4 sm:mb-6 leading-snug sm:leading-tight"
								>
									EXPERIENCE RESULTS
									<br />
									IN{" "}
									<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
										REALTIME
									</span>
									<br />
									RESULTS
								</h2>

								<p
									className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 
                             leading-relaxed max-w-md sm:max-w-xl mx-auto lg:mx-0"
								>
									A powerful feature header combines clean icons, bold
									typography, engaging visuals, and a clear layout to highlight
									functionality, ease of use, and the value your product
									delivers.
								</p>

								<div className="flex justify-center lg:justify-start">
									<button
										className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
                               py-2 px-6 sm:py-2.5 sm:px-8 uppercase tracking-wide shadow-lg 
                               transform skew-x-[-12deg] transition-all duration-300 
                               hover:scale-105 text-xs sm:text-sm md:text-base"
									>
										<span className="inline-block skew-x-[12deg]">
											EXPLORE NOW
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<Testimonials />
		</div>
	);
};

export default Home;
