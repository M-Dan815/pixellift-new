import React, {useEffect, useRef, useState} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Link, useNavigate} from "react-router-dom";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Platform Logo Components
const AmazonLogo = ({className}) => (
	<svg
		className={className}
		viewBox="0 0 603 182"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M374.006 142.184C339.063 168.093 288.327 182 244.553 182C183.606 182 128.884 159.116 87.2027 121.098C83.8727 118.065 86.8594 113.917 90.8627 116.322C135.839 142.477 191.576 158.083 249.147 158.083C287.984 158.083 330.471 150.118 369.529 133.546C375.287 131.083 380.189 137.368 374.006 142.184Z" />
		<path d="M387.793 126.374C383.34 120.617 357.856 123.663 346.407 125.034C343.003 125.463 342.479 122.49 345.556 120.305C365.697 106.023 399.315 110.286 403.148 115.055C406.982 119.881 402.042 153.573 383.173 169.545C380.303 172.003 377.563 170.719 378.834 167.542C382.998 156.879 392.303 132.204 387.793 126.374Z" />
		<path d="M347.242 19.4949V6.05474C347.242 4.01294 348.827 2.64917 350.672 2.64917H410.489C412.407 2.64917 413.993 4.05568 413.993 6.05474V17.6949C413.921 19.6082 411.954 22.1276 408.967 26.2376L377.591 71.5757C388.867 71.2894 400.763 72.9467 410.994 78.7236C413.378 80.0945 414.02 82.1293 414.214 84.0426V98.3852C414.214 100.341 412.061 102.625 409.849 101.462C392.274 92.2156 368.681 91.2098 349.417 101.57C347.388 102.647 345.186 100.398 345.186 98.4423V84.7941C345.186 82.6024 345.222 78.5782 347.438 75.1693L383.909 22.5121H350.745C348.827 22.5121 347.242 21.1483 347.242 19.4949Z" />
		<path d="M124.635 105.286H105.697C103.969 105.157 102.594 103.857 102.465 102.221V6.3125C102.465 4.45648 104.03 2.95609 105.971 2.95609H123.63C125.387 3.04158 126.799 4.39106 126.928 6.07668V19.6804H127.281C131.68 6.74632 140.582 0.727539 153.182 0.727539C165.97 0.727539 173.997 6.74632 179.103 19.6804C183.473 6.74632 194.127 0.727539 206.229 0.727539C214.949 0.727539 224.546 4.44219 230.521 12.5505C237.243 21.4817 235.846 34.2301 235.846 45.5912L235.81 102.006C235.81 103.862 234.245 105.286 232.304 105.286H213.402C211.578 105.157 210.123 103.786 210.123 102.006V53.0796C210.123 48.6366 210.476 36.9223 209.826 32.6651C208.805 25.2241 204.08 23.1896 198.18 23.1896C193.111 23.1896 187.801 26.5129 185.537 31.8582C183.274 37.2036 183.473 46.1347 183.473 53.0796V102.006C183.473 103.862 181.908 105.286 179.967 105.286H161.065C159.205 105.157 157.786 103.786 157.786 102.006L157.75 53.0796C157.75 41.3724 159.613 22.9967 144.894 22.9967C130.019 22.9967 130.548 40.7568 130.548 53.0796V102.006C130.548 103.862 128.983 105.286 127.043 105.286H124.635Z" />
		<path d="M463.834 0.727539C491.855 0.727539 507.002 23.1896 507.002 52.4597C507.002 80.7222 489.794 102.57 463.834 102.57C436.79 102.57 421.819 80.1079 421.819 51.4521C421.819 22.6035 436.966 0.727539 463.834 0.727539ZM463.998 18.8233C449.082 18.8233 448.205 39.1697 448.205 51.8323C448.205 64.5235 447.994 82.2764 463.834 82.2764C479.498 82.2764 480.375 60.7228 480.375 47.4674C480.375 38.1558 480.023 26.8161 477.013 18.0921C474.425 10.4511 469.7 18.8233 463.998 18.8233Z" />
		<path d="M536.802 105.286H517.971C516.147 105.157 514.692 103.786 514.692 102.006L514.656 6.01975C514.785 4.32697 516.36 2.95605 518.208 2.95605H535.729C537.323 3.02011 538.664 4.15519 539.008 5.71978V21.6674H539.36C544.466 7.13183 552.318 0.727539 566.174 0.727539C575.597 0.727539 584.818 4.24928 591.352 13.7376C597.521 22.6107 597.521 36.9223 597.521 47.8489V102.435C597.32 104.049 595.762 105.286 594.047 105.286H575.044C573.459 105.157 572.161 104.006 571.989 102.435V52.0449C571.989 40.3378 573.305 22.7892 558.235 22.7892C553.143 22.7892 548.418 26.3109 546.003 31.4706C542.876 38.0272 542.523 44.5553 542.523 52.0449V102.006C542.487 103.862 540.886 105.286 536.802 105.286Z" />
		<path d="M314.369 59.7151C314.369 67.0133 314.546 73.1606 310.706 79.6887C307.594 85.0341 302.516 88.3573 296.934 88.3573C289.233 88.3573 284.684 82.4957 284.684 73.7788C284.684 56.6277 299.871 53.5973 314.369 53.5973V59.7151ZM337.482 105.072C336.129 106.294 334.16 106.38 332.595 105.544C325.583 99.725 324.358 96.9484 320.499 91.4173C308.634 103.572 300.265 107.202 284.614 107.202C266.075 107.202 251.68 95.787 251.68 72.7283C251.68 54.6485 261.465 42.1363 275.698 36.1033C287.979 30.7865 305.346 29.7807 318.129 28.1305V26.3744C318.129 22.6742 318.482 18.2312 316.358 15.0794C314.482 12.2671 310.887 11.0757 307.696 11.0757C301.758 11.0757 296.471 14.1204 295.201 20.4985C294.938 21.9622 293.887 23.4046 292.437 23.4831L274.102 21.4842C272.784 21.19 271.325 20.127 271.692 18.1352C275.742 -2.88529 295.411 -8.75415 313.084 2.82506C321.793 2.82506 332.878 2.82506 340.372 9.90463C349.988 18.6501 349.115 30.3501 349.115 43.2842V73.9645C349.115 83.325 352.984 87.4278 356.624 92.6017C357.856 94.3507 358.109 96.4353 356.544 97.7277C352.648 101.013 345.739 106.967 341.914 110.382L341.878 110.339C340.485 108.518 338.876 106.795 337.482 105.072Z" />
		<path d="M57.1035 59.7151C57.1035 67.0133 57.2817 73.1606 53.4415 79.6887C50.3295 85.0341 45.2513 88.3573 39.6695 88.3573C31.9686 88.3573 27.4198 82.4957 27.4198 73.7788C27.4198 56.6277 42.6072 53.5973 57.1035 53.5973V59.7151ZM80.2166 105.072C78.8644 106.294 76.8946 106.38 75.3297 105.544C68.3183 99.725 67.0936 96.9484 63.234 91.4173C51.3696 103.572 42.9995 107.202 27.3488 107.202C8.80993 107.202 -5.58472 95.787 -5.58472 72.7283C-5.58472 54.6485 4.20012 42.1363 18.4325 36.1033C30.7139 30.7865 48.0813 29.7807 60.8636 28.1305V26.3744C60.8636 22.6742 61.2168 18.2312 59.0929 15.0794C57.2168 12.2671 53.6218 11.0757 50.4309 11.0757C44.4927 11.0757 39.2058 14.1204 37.936 20.4985C37.6729 21.9622 36.6218 23.4046 35.1719 23.4831L16.8371 21.4842C15.5185 21.19 14.0593 20.127 14.4262 18.1352C18.4768 -2.88529 38.1463 -8.75415 55.8192 2.82506C64.5282 2.82506 75.6137 2.82506 83.1073 9.90463C92.7227 18.6501 91.8503 30.3501 91.8503 43.2842V73.9645C91.8503 83.325 95.7191 87.4278 99.3588 92.6017C100.591 94.3507 100.844 96.4353 99.2789 97.7277C95.3831 101.013 88.474 106.967 84.649 110.382L84.6127 110.339C83.2199 108.518 81.6104 106.795 80.2166 105.072Z" />
	</svg>
);

const EbayLogo = ({className}) => (
	<svg
		className={className}
		viewBox="0 0 300 120"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M37.48 73.36c0-15.84 9.36-25.2 24.48-25.2 13.44 0 22.08 8.16 22.08 23.52v4.8H49.96c.72 9.12 6.48 14.16 15.12 14.16 6.72 0 11.76-2.88 14.16-7.68l9.36 4.8c-4.32 8.16-13.2 13.2-24 13.2-17.28 0-27.12-11.04-27.12-27.6zm34.08-6.24c-.48-7.44-5.04-11.76-12-11.76-7.44 0-12.24 4.56-13.44 11.76h25.44z"
			fill="#E53238"
		/>
		<path
			d="M92.2 27.76h12.24v30.96h.24c3.36-6 10.08-10.08 18.96-10.08 14.88 0 24.24 11.76 24.24 27.12 0 15.6-9.36 27.84-24.72 27.84-8.64 0-15.36-3.84-18.72-10.32h-.24v8.88H92.2V27.76zm28.08 68.4c9.12 0 15.12-7.2 15.12-18s-6-17.76-15.12-17.76c-9.36 0-15.36 7.2-15.36 17.76 0 10.8 6 18 15.36 18z"
			fill="#0064D2"
		/>
		<path
			d="M189.4 102.16h-11.76v-8.64h-.24c-3.36 6.24-9.84 10.08-18.72 10.08-14.88 0-24.48-12-24.48-27.6 0-15.36 9.36-27.36 24.24-27.36 8.88 0 15.6 4.08 18.96 10.08h.24V49.84h11.76v52.32zm-28.32-8.16c9.36 0 15.36-7.2 15.36-18s-6-17.76-15.36-17.76c-9.12 0-15.12 6.96-15.12 17.76 0 10.8 6 18 15.12 18z"
			fill="#F5AF02"
		/>
		<path
			d="M193.72 49.84h13.2l16.08 40.32h.24l15.6-40.32h12.72l-28.8 68.4h-12.72l8.16-18.72-24.48-49.68z"
			fill="#86B817"
		/>
	</svg>
);

const ShopifyLogo = ({className}) => (
	<svg
		className={className}
		viewBox="0 0 109 124"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M95.035 23.528C95.035 23.528 94.762 23.528 94.625 23.665C94.488 23.802 92.85 23.939 92.85 23.939C92.85 23.939 79.838 10.79 78.61 9.562C77.381 8.334 74.925 8.608 73.97 8.882C73.833 8.882 71.514 9.562 67.831 10.653C66.33 6.015 63.601 1.788 58.418 1.788H57.463C55.689 -0.668 53.507 -0.121 51.597 -0.121C35.585 -0.121 27.607 20.115 25.015 30.321C17.855 32.64 12.808 34.14 12.126 34.414C9.261 35.368 9.125 35.505 8.852 38.233C8.579 40.278 0.873 101.389 0.873 101.389L71.65 115.493L108.163 107.106C108.163 107.106 95.035 24.483 95.035 23.528ZM63.465 13.654C60.463 14.609 57.053 15.7 53.507 16.928C53.507 12.563 52.825 6.562 50.096 1.924C56.098 3.015 59.508 9.699 63.465 13.654ZM47.453 18.156C40.566 20.338 33.133 22.657 25.7 24.976C27.88 17.27 32.042 9.562 37.907 6.015C40.02 4.787 42.886 3.423 46.087 3.287C49.016 8.198 47.59 14.609 47.453 18.156ZM38.657 1.924C40.293 1.924 41.793 2.197 43.022 2.744C37.361 5.742 31.996 12.017 29.677 22.52C23.812 24.293 17.947 26.067 12.535 27.704C15.264 18.566 24.196 1.924 38.657 1.924Z" />
		<path
			d="M94.625 23.665C94.488 23.802 92.85 23.939 92.85 23.939C92.85 23.939 79.838 10.79 78.61 9.562C78.2 9.152 77.654 8.882 77.108 8.745V115.356L108.163 107.106C108.163 107.106 95.035 24.483 95.035 23.528C95.035 23.528 94.762 23.528 94.625 23.665Z"
			fillOpacity="0.2"
		/>
		<path
			d="M58.145 40.005L53.917 55.608C53.917 55.608 49.279 53.153 43.824 53.426C35.709 53.836 35.709 58.884 35.709 60.111C36.119 67.134 54.327 68.635 55.418 85.193C56.236 98.341 48.394 107.243 37.088 107.926C23.53 108.744 16.097 100.767 16.097 100.767L18.826 88.575C18.826 88.575 26.392 94.166 32.257 93.756C36.119 93.483 37.497 90.344 37.361 88.165C36.814 79.163 22.029 79.71 21.074 64.609C20.256 51.871 28.507 39.006 46.851 37.778C53.917 37.232 57.327 39.141 58.145 40.005Z"
			fill="white"
		/>
	</svg>
);

const Cards = () => {
	const navigate = useNavigate();
	const heroRef = useRef(null);
	const headingRef = useRef(null);
	const subtextRef = useRef(null);
	const buttonsRef = useRef(null);
	const cardsRef = useRef(null);
	const cardRefs = useRef([]);
	const [hoveredCard, setHoveredCard] = useState(null);

	// Platform cards data with enhanced visuals
	const platformCards = [
		{
			id: 1,
			name: "AMAZON",
			description:
				"Transform your Amazon product images with AI-powered background removal and enhancement. Meet Amazon's strict image requirements with professional white backgrounds.",
			features: [
				"White Background Required",
				"1000px Minimum Resolution",
				"Professional Enhancement",
				"SP-API Integration",
			],
			gradient: "from-orange-400 via-amber-500 to-yellow-400",
			primaryColor: "#ff9500",
			secondaryColor: "#ffb340",
			shadowColor: "rgba(255, 149, 0, 0.4)",
			LogoComponent: AmazonLogo,
			logoColor: "#FF9900",
			bgPattern:
				"radial-gradient(circle at 20% 80%, rgba(255, 149, 0, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 179, 64, 0.2) 0%, transparent 50%)",
			buttonText: "ENHANCE FOR AMAZON",
			route: "/view?platform=amazon",
			stats: ["99.9% Uptime", "500K+ Images", "24/7 Support"],
		},
		{
			id: 2,
			name: "EBAY",
			description:
				"Optimize your eBay listings with stunning lifestyle backgrounds and professional product photography. Stand out in the marketplace with eye-catching visuals.",
			features: [
				"Lifestyle Backgrounds",
				"500px Minimum Resolution",
				"Studio Quality Enhancement",
				"Trading API Integration",
			],
			gradient: "from-blue-400 via-purple-500 to-indigo-600",
			primaryColor: "#3b82f6",
			secondaryColor: "#8b5cf6",
			shadowColor: "rgba(59, 130, 246, 0.4)",
			LogoComponent: EbayLogo,
			logoColor: "#E53238",
			bgPattern:
				"radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
			buttonText: "ENHANCE FOR EBAY",
			route: "/view?platform=ebay",
			stats: ["Lightning Fast", "AI Powered", "Pro Quality"],
		},
		{
			id: 3,
			name: "SHOPIFY",
			description:
				"Create premium product images for your Shopify store with AI-generated backgrounds and professional optimization. Boost conversion rates with stunning visuals.",
			features: [
				"Premium Backgrounds",
				"2048px High Resolution",
				"Brand Consistent Styling",
				"Admin API Integration",
			],
			gradient: "from-emerald-400 via-green-500 to-teal-600",
			primaryColor: "#10b981",
			secondaryColor: "#34d399",
			shadowColor: "rgba(16, 185, 129, 0.4)",
			LogoComponent: ShopifyLogo,
			logoColor: "#95BF47",
			bgPattern:
				"radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.2) 0%, transparent 50%)",
			buttonText: "ENHANCE FOR SHOPIFY",
			route: "/view?platform=shopify",
			stats: ["Enterprise", "Scalable", "Reliable"],
		},
	];

	// Navigation function for button clicks
	const handlePlatformNavigation = (route) => {
		navigate(route);
	};

	// Enhanced card animations
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate the section heading
			gsap.from(".section-heading h2", {
				y: -50,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
				scrollTrigger: {
					trigger: cardsRef.current,
					start: "top 80%",
					toggleActions: "play none none none",
				},
			});

			// Animate card headings with a slight delay
			gsap.utils.toArray(".card-heading").forEach((heading, i) => {
				gsap.from(heading, {
					y: 30,
					opacity: 0,
					duration: 0.8,
					delay: 0.2 + i * 0.1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: heading,
						start: "top 90%",
						toggleActions: "play none none none",
					},
				});
			});

			// Animate cards
			cardRefs.current.forEach((cardRef, index) => {
				if (cardRef) {
					gsap.set(cardRef, {
						opacity: 0,
						y: 100,
						scale: 0.8,
						rotationY: 15,
					});

					gsap.to(cardRef, {
						opacity: 1,
						y: 0,
						scale: 1,
						rotationY: 0,
						duration: 1,
						ease: "power3.out",
						delay: index * 0.3,
						scrollTrigger: {
							trigger: cardsRef.current,
							start: "top 80%",
							toggleActions: "play none none reverse",
						},
					});
				}
			});
		}, cardsRef);

		return () => ctx.revert();
	}, []);

	return (
		<div className="bg-gradient-to-br from-[#1a1c54] via-[#2d2e7a] to-[#4c0d73] min-h-screen">
			{/* Background pattern overlay */}
			<div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')]"></div>

			{/* Revolutionary Platform Cards Section */}
			<section
				ref={cardsRef}
				className="py-20 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden relative"
			>
				{/* Animated background particles */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-30"></div>
					<div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
					<div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-25"></div>
					<div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-35"></div>
				</div>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

				<div className="relative z-10 max-w-7xl mx-auto w-full">
					{/* Section Heading */}
					<div className="section-heading text-center mb-20">
						<h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-none">
							SELECT YOUR <br className="hidden sm:block" />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 animate-pulse">
								DESTINATION
							</span>
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
							Each platform demands perfection. Choose yours and witness the
							transformation.
						</p>
					</div>

					{/* Revolutionary Cards Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-1000">
						{platformCards.map((card, index) => {
							const LogoComponent = card.LogoComponent;

							return (
								<div
									key={card.id}
									ref={(el) => (cardRefs.current[index] = el)}
									className="group relative transform-gpu"
									onMouseEnter={() => setHoveredCard(card.id)}
									onMouseLeave={() => setHoveredCard(null)}
								>
									{/* Outer glow effect - Reduced intensity */}
									<div
										className={`absolute inset-0 rounded-3xl blur-md opacity-0 group-hover:opacity-20 transition-all duration-700 bg-gradient-to-r ${card.gradient}`}
										style={{transform: "scale(1.05)"}}
									></div>

									{/* Main Card Container */}
									<div
										className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden
                                 transform group-hover:scale-102 transition-all duration-700 group-hover:border-white/30
                                 shadow-2xl group-hover:shadow-4xl min-h-[650px] flex flex-col"
									>
										{/* Dynamic Background Pattern */}
										<div
											className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-700"
											style={{background: card.bgPattern}}
										></div>

										{/* Animated border */}
										<div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700">
											<div
												className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${card.gradient} animate-pulse`}
												style={{
													background: `linear-gradient(45deg, ${card.primaryColor}10, ${card.secondaryColor}10, ${card.primaryColor}10)`,
													backgroundSize: "400% 400%",
													animation:
														hoveredCard === card.id
															? "gradientShift 3s ease infinite"
															: "none",
												}}
											></div>
										</div>

										{/* Content Container */}
										<div className="relative z-20 p-8 flex flex-col h-full">
											{/* Action Button at TOP */}
											<div className="mb-6">
												<button
													onClick={() => handlePlatformNavigation(card.route)}
													className="relative w-full group/btn overflow-hidden"
												>
													{/* Button background with animated gradient */}
													<div
														className={`absolute inset-0 bg-gradient-to-r ${card.gradient} 
                                           transform scale-105 blur-sm opacity-50 
                                           group-hover/btn:scale-110 group-hover/btn:opacity-70 
                                           transition-all duration-500`}
													></div>

													{/* Main button */}
													<div
														className={`relative bg-gradient-to-r ${card.gradient} text-white font-black 
                                           py-4 px-8 uppercase tracking-wider shadow-2xl 
                                           transform skew-x-[-8deg] transition-all duration-500 
                                           group-hover/btn:scale-105 group-hover/btn:skew-x-[-4deg] 
                                           text-sm border-2 border-white/20 group-hover/btn:border-white/40`}
														style={{
															boxShadow:
																hoveredCard === card.id
																	? `0 10px 40px ${card.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`
																	: `0 4px 20px ${card.shadowColor}40`,
														}}
													>
														<span className="inline-block skew-x-[8deg] relative z-10">
															{card.buttonText}
														</span>

														{/* Animated shine effect */}
														<div
															className="absolute inset-0 -skew-x-12 translate-x-[-100%] 
                                            bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                            group-hover/btn:translate-x-[100%] transition-transform duration-1000"
														></div>
													</div>

													{/* Floating particles effect */}
													<div className="absolute inset-0 opacity-0 group-hover/btn:opacity-50 transition-opacity duration-500">
														<div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
														<div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
														<div className="absolute bottom-1/3 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-bounce delay-100"></div>
													</div>
												</button>
											</div>

											{/* Header Section */}
											<div className="text-center mb-6">
												{/* Platform Logo */}
												<div className="relative inline-block mb-4">
													<div
														className="w-24 h-24 flex items-center justify-center transform group-hover:scale-110 
                                          transition-all duration-500"
													>
														<LogoComponent
															className="w-full h-full"
															style={{color: card.logoColor}}
														/>
													</div>
													<div
														className={`absolute -inset-4 rounded-full blur-2xl opacity-0 group-hover:opacity-20 
                                           transition-all duration-700 bg-gradient-to-r ${card.gradient}`}
													></div>
												</div>

												{/* Platform Name with holographic effect */}
												<h3
													className={`card-heading text-3xl font-black mb-3 transform group-hover:scale-105 
                                        transition-all duration-500 bg-gradient-to-r ${card.gradient} 
                                        bg-clip-text text-transparent`}
													style={{
														textShadow:
															hoveredCard === card.id
																? `0 0 15px ${card.shadowColor}, 0 0 30px ${card.shadowColor}`
																: "none",
													}}
												>
													{card.name}
												</h3>

												{/* Stats badges */}
												<div className="flex flex-wrap justify-center gap-2 mb-4">
													{card.stats.map((stat, i) => (
														<span
															key={i}
															className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full 
                                                      text-xs text-white/80 border border-white/20
                                                      transform group-hover:scale-105 transition-all duration-300"
															style={{animationDelay: `${i * 100}ms`}}
														>
															{stat}
														</span>
													))}
												</div>
											</div>

											{/* Description */}
											<p
												className="text-gray-300 text-sm leading-relaxed mb-6 text-center
                                    group-hover:text-white transition-colors duration-500"
											>
												{card.description}
											</p>

											{/* Features with animated icons */}
											<div className="flex-grow">
												<div className="grid grid-cols-1 gap-3">
													{card.features.map((feature, featureIndex) => (
														<div
															key={featureIndex}
															className="flex items-center group-hover:translate-x-2 transition-all duration-300 
                                            bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10
                                            group-hover:bg-white/10 group-hover:border-white/20"
															style={{
																animationDelay: `${featureIndex * 100}ms`,
															}}
														>
															<div
																className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${card.gradient} 
                                              animate-pulse shadow-lg flex-shrink-0`}
																style={{
																	boxShadow:
																		hoveredCard === card.id
																			? `0 0 10px ${card.shadowColor}`
																			: "none",
																}}
															></div>
															<span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 font-medium">
																{feature}
															</span>
														</div>
													))}
												</div>
											</div>
										</div>

										{/* Holographic overlay */}
										<div
											className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700
                                     bg-gradient-to-br from-white via-transparent to-transparent 
                                     mix-blend-overlay pointer-events-none`}
										></div>
									</div>

									{/* Floating elements */}
									<div
										className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-white/10 to-transparent 
                                  rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 
                                  animate-pulse"
									></div>
									<div
										className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-tr from-white/10 to-transparent 
                                  rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-700 
                                  animate-bounce"
									></div>
								</div>
							);
						})}
					</div>

					{/* Enhanced Bottom Section */}
					<div className="text-center mt-12 sm:mt-16">
						<p className="text-gray-400 text-sm sm:text-base mb-6">
							Not sure which platform? Contact our team for personalized
							recommendations.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
							{/* Contact Support */}
							<Link
								to="/contact"
								className="border border-purple-400 text-purple-200 font-bold py-3 px-6 sm:px-8 
                           uppercase tracking-wide 
                           transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 
                           bg-transparent hover:border-purple-300 hover:text-white w-full sm:w-auto text-center inline-block"
							>
								<span className="inline-block skew-x-[12deg]">
									CONTACT SUPPORT
								</span>
							</Link>

							{/* Back to Home */}
							<Link
								to="/"
								className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 sm:px-8 
                           uppercase tracking-wide shadow-lg 
                           transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-block text-center"
							>
								<span className="inline-block skew-x-[12deg]">
									BACK TO HOME
								</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Custom CSS for animations */}
			<style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .shadow-4xl {
          box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.5), 
                      0 0 80px rgba(168, 85, 247, 0.2);
        }
      `}</style>
		</div>
	);
};

export default Cards;
