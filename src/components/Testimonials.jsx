import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import {gsap} from "gsap";
import User1 from "../../public/images/User1.png";
import User2 from "../../public/images/User2.png";

const Testimonials = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Refs for animation
	const containerRef = useRef(null);
	const cardsRef = useRef(null);
	const progressRef = useRef(null);
	const autoPlayRef = useRef(null);

	// Testimonials data
	const testimonials = [
		{
			id: 1,
			stars: 5,
			review:
				"One of the best features of this tool is how simple it makes enhancing images. It has helped me create quality product photos in seconds. The results are clear, polished, and have greatly improved the way my products look online.",
			name: "Arlene McCoy",
			company: "McDonald's",
			image: User1,
		},
		{
			id: 2,
			stars: 5,
			review:
				"Another thing I love about this platform is the supportive community and resources behind it. The tips, tutorials, and shared experiences from other users have helped me learn faster and get the most out of every feature",
			name: "Kathryn Murphy",
			company: "General Electric",
			image: User2,
		},
		{
			id: 3,
			stars: 5,
			review:
				"The AI-powered image enhancement has revolutionized our marketing campaigns. What used to take hours of editing now happens in minutes, and the quality is consistently exceptional. Our team productivity has increased dramatically.",
			name: "Robert Johnson",
			company: "Adobe Inc",
			image: User1,
		},
		{
			id: 4,
			stars: 5,
			review:
				"I've tried many image editing tools, but this platform stands out for its intuitive interface and powerful features. The automated background removal and color correction have saved us countless hours of manual work.",
			name: "Sarah Williams",
			company: "Microsoft",
			image: User2,
		},
		{
			id: 5,
			stars: 5,
			review:
				"The batch processing feature is a game-changer for our e-commerce business. We can now process hundreds of product images in minutes while maintaining professional quality standards. Absolutely recommended!",
			name: "Michael Brown",
			company: "Amazon",
			image: User1,
		},
		{
			id: 6,
			stars: 5,
			review:
				"Customer support is outstanding and the learning curve is minimal. The real-time preview feature helps us make perfect adjustments before finalizing our images. This tool has become essential to our workflow.",
			name: "Emma Davis",
			company: "Google",
			image: User2,
		},
	];

	// Handle responsive breakpoints
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			setCurrentIndex(0);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Calculate max index based on screen size
	const getMaxIndex = () => {
		return isMobile
			? testimonials.length - 1
			: Math.floor(testimonials.length / 2) - 1;
	};

	// Animate transition to new index
	const animateToIndex = (newIndex, direction = 1) => {
		if (isAnimating || !cardsRef.current) return;

		setIsAnimating(true);

		const tl = gsap.timeline({
			onComplete: () => {
				setCurrentIndex(newIndex);
				setIsAnimating(false);
				// Reset progress bar
				if (progressRef.current) {
					gsap.fromTo(
						progressRef.current,
						{scaleX: 0},
						{scaleX: 1, duration: 5, ease: "linear"}
					);
				}
			},
		});

		// Animate out current cards
		tl.to(cardsRef.current, {
			opacity: 0,
			x: direction * -80,
			scale: 0.95,
			duration: 0.4,
			ease: "power2.in",
		});

		// Update the index and animate in new cards
		tl.call(() => setCurrentIndex(newIndex));

		tl.to(cardsRef.current, {
			opacity: 1,
			x: 0,
			scale: 1,
			duration: 0.5,
			ease: "power2.out",
		});
	};

	// Auto-slide functionality with longer interval
	useEffect(() => {
		// Start progress bar animation
		if (progressRef.current) {
			gsap.fromTo(
				progressRef.current,
				{scaleX: 0},
				{scaleX: 1, duration: 5, ease: "linear"}
			);
		}

		autoPlayRef.current = setInterval(() => {
			if (!isAnimating) {
				const maxIndex = getMaxIndex();
				const nextIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
				animateToIndex(nextIndex, 1);
			}
		}, 5000); // Changed to 5 seconds

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
			}
		};
	}, [currentIndex, isMobile, isAnimating]);

	// Handle dot click
	const handleDotClick = (index) => {
		if (index === currentIndex || isAnimating) return;

		// Clear auto-play
		if (autoPlayRef.current) {
			clearInterval(autoPlayRef.current);
		}

		const direction = index > currentIndex ? 1 : -1;
		animateToIndex(index, direction);
	};

	// Get current testimonials to display
	const getCurrentTestimonials = () => {
		if (isMobile) {
			return [testimonials[currentIndex]];
		} else {
			const startIndex = currentIndex * 2;
			return [testimonials[startIndex], testimonials[startIndex + 1]].filter(
				Boolean
			);
		}
	};

	// Calculate number of dots
	const getDotsCount = () => {
		return isMobile ? testimonials.length : Math.ceil(testimonials.length / 2);
	};

	const TestimonialCard = ({testimonial, index}) => (
		<div
			className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 h-96 md:h-96 relative overflow-visible"
			style={{
				animationDelay: `${index * 0.1}s`,
			}}
		>
			{/* Top Right Quote Marks - Half inside, half outside */}
			<div className="absolute -top-6 -right-3">
				<div className="flex gap-1">
					<div className="w-8 h-12 bg-gradient-to-b from-pink-500 to-purple-500 transform skew-x-12"></div>
					<div className="w-8 h-12 bg-gradient-to-b from-purple-500 to-blue-500 transform skew-x-12"></div>
				</div>
			</div>

			{/* 5 Stars */}
			<div className="flex gap-1 mb-6">
				{[...Array(testimonial.stars)].map((_, i) => (
					<svg
						key={i}
						className="w-6 h-6 text-white fill-current"
						viewBox="0 0 24 24"
					>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
					</svg>
				))}
			</div>

			{/* Review Text - Adjusted for mobile */}
			<p className="text-white text-lg leading-relaxed mb-6 md:mb-8 line-clamp-5 md:line-clamp-none">
				{testimonial.review}
			</p>

			{/* White Divider Line */}
			<hr className="border-white/30 mb-6" />

			{/* User Info */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<img
						src={testimonial.image}
						alt={testimonial.name}
						className="w-12 h-12 rounded-full object-cover"
					/>
					<div>
						<h4 className="text-white font-semibold text-lg">
							{testimonial.name}
						</h4>
						<p className="text-gray-300 text-sm">{testimonial.company}</p>
					</div>
				</div>

				{/* Verified Badge */}
				<div className="flex items-center gap-2">
					<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
						<defs>
							<linearGradient
								id={`grad${testimonial.id}`}
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="#ec4899" />
								<stop offset="100%" stopColor="#8b5cf6" />
							</linearGradient>
						</defs>
						<path
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							stroke={`url(#grad${testimonial.id})`}
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill={`url(#grad${testimonial.id})`}
							fillOpacity="0.2"
						/>
					</svg>
					<span className="text-white text-sm font-medium">Verified</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 py-20 px-6 md:px-12 overflow-hidden">
			<div className="max-w-7xl mx-auto" ref={containerRef}>
				{/* Title */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
						CLIENT{" "}
						<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
							TESTIMONIALS
						</span>
					</h2>
				</div>

				{/* Testimonial Cards with Animation Wrapper */}
				<div
					ref={cardsRef}
					className="grid md:grid-cols-2 gap-8 mb-12"
					style={{willChange: "transform, opacity"}}
				>
					{getCurrentTestimonials().map((testimonial, index) => (
						<TestimonialCard
							key={`${currentIndex}-${testimonial.id}`}
							testimonial={testimonial}
							index={index}
						/>
					))}
				</div>

				{/* Progress Bar */}
				<div className="max-w-md mx-auto mb-6">
					<div className="h-1 bg-white/20 rounded-full overflow-hidden">
						<div
							ref={progressRef}
							className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full origin-left"
							style={{transform: "scaleX(0)"}}
						/>
					</div>
				</div>

				{/* Pagination Dots */}
				<div className="flex justify-center gap-3">
					{Array.from({length: getDotsCount()}).map((_, index) => (
						<button
							key={index}
							disabled={isAnimating}
							className={`h-3 rounded-full transition-all duration-500 cursor-pointer disabled:cursor-not-allowed
                ${
									index === currentIndex
										? "w-10 bg-gradient-to-r from-pink-500 to-purple-500"
										: "w-3 bg-white/50 hover:bg-white/70"
								}`}
							onClick={() => handleDotClick(index)}
							aria-label={`Go to testimonial ${index + 1}`}
						/>
					))}
				</div>

				{/* Counter */}
				<div className="text-center mt-4">
					<span className="text-white/60 text-sm">
						<span className="text-white font-bold text-lg">
							{currentIndex + 1}
						</span>
						<span className="mx-2">/</span>
						<span>{getDotsCount()}</span>
					</span>
				</div>
			</div>
		</div>
	);
};

export default Testimonials;
