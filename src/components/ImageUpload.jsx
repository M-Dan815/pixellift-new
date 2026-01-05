import React, {useState, useRef} from "react";
import axios from "axios";
import {
	Image as ImageIcon,
	Download,
	Check,
	Trash2,
	Upload,
	Loader2,
	Plus,
	AlertCircle,
} from "lucide-react";

const ImageUpload = ({
	platform,
	uploadedImages = [],
	setUploadedImages,
	selectedImages,
	setSelectedImages,
	addLog,
}) => {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [dragOver, setDragOver] = useState(false);
	const fileInputRef = useRef(null);

	const uploadEndpoint =
		"https://nodebackend-production-50db.up.railway.app/upload";

	// Handle file upload
	const handleFileUpload = async (files) => {
		if (!files || files.length === 0) return;

		const validFiles = Array.from(files).filter((file) => {
			const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
			const maxSize = 10 * 1024 * 1024; // 10MB

			if (!validTypes.includes(file.type)) {
				addLog(
					`⚠️ Skipped ${file.name}: Invalid file type. Use JPG, PNG, WebP, or GIF`,
					"warning"
				);
				return false;
			}

			if (file.size > maxSize) {
				addLog(`⚠️ Skipped ${file.name}: File too large (max 10MB)`, "warning");
				return false;
			}

			return true;
		});

		if (validFiles.length === 0) return;

		setIsUploading(true);
		setUploadProgress(0);
		addLog(`📤 Uploading ${validFiles.length} image(s)...`, "info");

		const newUploadedImages = [];
		let successCount = 0;
		let failCount = 0;

		for (let i = 0; i < validFiles.length; i++) {
			const file = validFiles[i];
			setUploadProgress(Math.round((i / validFiles.length) * 100));

			try {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("platform", platform);

				let user_id = localStorage.getItem("user");
				if (user_id) {
					user_id = JSON.parse(user_id).id;
					formData.append("user_id", user_id);
				}

				const response = await axios.post(uploadEndpoint, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					onUploadProgress: (progressEvent) => {
						const fileProgress = Math.round(
							(progressEvent.loaded / progressEvent.total) * 100
						);
						const overallProgress = Math.round(
							((i + fileProgress / 100) / validFiles.length) * 100
						);
						setUploadProgress(overallProgress);
					},
					timeout: 60000,
				});

				if (response.data && response.data.success && response.data.url) {
					const uploadedImage = {
						id: `uploaded-${Date.now()}-${i}`,
						url: response.data.url,
						name: file.name,
						size: formatFileSize(file.size),
						platform: platform,
						source: "uploaded",
						publicId: response.data.publicId,
						uploadedAt: new Date().toISOString(),
						isLocal: false, // Successfully uploaded to server
					};

					newUploadedImages.push(uploadedImage);
					successCount++;
					addLog(`✅ Uploaded: ${file.name}`, "success");
				} else {
					throw new Error(
						response.data?.message || "No URL returned from server"
					);
				}
			} catch (error) {
				console.error("Upload error:", error);
				failCount++;

				// Create local preview but mark it as local-only (can't be processed by backend)
				try {
					const dataUrl = await fileToDataUrl(file);

					const fallbackImage = {
						id: `uploaded-local-${Date.now()}-${i}`,
						url: dataUrl, // This is a data URL, not a blob URL
						name: file.name,
						size: formatFileSize(file.size),
						platform: platform,
						source: "uploaded-local",
						isLocal: true, // Mark as local - cannot be processed by backend
						uploadedAt: new Date().toISOString(),
						originalFile: file, // Keep reference to retry upload later
					};

					newUploadedImages.push(fallbackImage);
					addLog(
						`⚠️ ${file.name} saved locally. Backend processing unavailable - please retry upload.`,
						"warning"
					);
				} catch (localError) {
					addLog(`❌ Failed to process: ${file.name}`, "error");
				}
			}
		}

		setUploadProgress(100);

		if (newUploadedImages.length > 0) {
			setUploadedImages((prev) => [...newUploadedImages, ...prev]);

			if (successCount > 0) {
				addLog(
					`✨ Added ${successCount} image(s) ready for processing`,
					"success"
				);
			}
			if (failCount > 0) {
				addLog(
					`⚠️ ${failCount} image(s) saved locally only - retry upload for backend processing`,
					"warning"
				);
			}
		}

		if (failCount > 0 && successCount === 0) {
			addLog(
				`❌ All uploads failed. Please check your connection and try again.`,
				"error"
			);
		}

		setIsUploading(false);
		setUploadProgress(0);
	};

	// Retry upload for a local image
	const retryUpload = async (imageId) => {
		const image = uploadedImages.find((img) => img.id === imageId);
		if (!image || !image.isLocal) return;

		addLog(`🔄 Retrying upload for ${image.name}...`, "info");

		try {
			// If we have the original file, use it
			if (image.originalFile) {
				const formData = new FormData();
				formData.append("file", image.originalFile);
				formData.append("platform", platform);

				let user_id = localStorage.getItem("user");
				if (user_id) {
					user_id = JSON.parse(user_id).id;
					formData.append("user_id", user_id);
				}

				const response = await axios.post(uploadEndpoint, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					timeout: 60000,
				});

				if (response.data && response.data.success && response.data.url) {
					// Update the image with the server URL
					setUploadedImages((prev) =>
						prev.map((img) => {
							if (img.id === imageId) {
								return {
									...img,
									url: response.data.url,
									publicId: response.data.publicId,
									isLocal: false,
									source: "uploaded",
									originalFile: undefined, // Clean up file reference
								};
							}
							return img;
						})
					);

					// Update selection if this image was selected
					setSelectedImages((prev) =>
						prev.map((img) => {
							if (img.id === imageId) {
								return {
									...img,
									url: response.data.url,
									isLocal: false,
								};
							}
							return img;
						})
					);

					addLog(`✅ Successfully uploaded: ${image.name}`, "success");
				} else {
					throw new Error("Upload failed");
				}
			} else {
				addLog(
					`❌ Cannot retry: Original file not available. Please re-upload.`,
					"error"
				);
			}
		} catch (error) {
			console.error("Retry upload error:", error);
			addLog(`❌ Retry failed for ${image.name}. Please try again.`, "error");
		}
	};

	const fileToDataUrl = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target.result);
			reader.onerror = (e) => reject(e);
			reader.readAsDataURL(file);
		});
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		const files = e.dataTransfer.files;
		handleFileUpload(files);
	};

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileInputChange = (e) => {
		const files = e.target.files;
		handleFileUpload(files);
		e.target.value = "";
	};

	const toggleImageSelection = (id) => {
		const image = uploadedImages.find((img) => img.id === id);
		if (!image) return;

		// Warn if selecting a local image
		if (image.isLocal) {
			addLog(
				`⚠️ "${image.name}" is stored locally and cannot be processed by the backend. Please retry upload first.`,
				"warning"
			);
		}

		setSelectedImages((prev) => {
			const isSelected = prev.some((selectedImg) => selectedImg.id === id);

			if (isSelected) {
				return prev.filter((selectedImg) => selectedImg.id !== id);
			} else {
				return [
					...prev,
					{
						id: image.id,
						url: image.url,
						source: image.source || "uploaded",
						name: image.name,
						isLocal: image.isLocal || false,
					},
				];
			}
		});

		setUploadedImages((prev) =>
			prev.map((img) =>
				img.id === id ? {...img, selected: !img.selected} : img
			)
		);
	};

	const toggleSelectAll = () => {
		// Only select images that are NOT local (can be processed)
		const processableImages = uploadedImages.filter((img) => !img.isLocal);

		if (processableImages.length === 0) {
			addLog(
				"⚠️ No processable images available. Please upload images to the server first.",
				"warning"
			);
			return;
		}

		const selectedUploadedCount = selectedImages.filter(
			(img) =>
				(img.source === "uploaded" || img.source === "uploaded-local") &&
				!img.isLocal
		).length;

		if (selectedUploadedCount === processableImages.length) {
			// Deselect only uploaded images
			setSelectedImages((prev) =>
				prev.filter(
					(img) => img.source !== "uploaded" && img.source !== "uploaded-local"
				)
			);
			setUploadedImages((prev) =>
				prev.map((img) => ({...img, selected: false}))
			);
		} else {
			// Select all processable uploaded images
			const allUploaded = processableImages.map((img) => ({
				id: img.id,
				url: img.url,
				source: img.source || "uploaded",
				name: img.name,
				isLocal: false,
			}));

			// Remove any existing uploaded selections and add all processable ones
			setSelectedImages((prev) => {
				const nonUploaded = prev.filter(
					(img) => img.source !== "uploaded" && img.source !== "uploaded-local"
				);
				return [...nonUploaded, ...allUploaded];
			});
			setUploadedImages((prev) =>
				prev.map((img) => ({
					...img,
					selected: !img.isLocal,
				}))
			);
		}
	};

	const removeSelectedImages = () => {
		const selectedUploadedIds = selectedImages
			.filter(
				(img) => img.source === "uploaded" || img.source === "uploaded-local"
			)
			.map((selectedImg) => selectedImg.id);

		setUploadedImages((prev) =>
			prev.filter((img) => !selectedUploadedIds.includes(img.id))
		);

		// Remove only uploaded images from selection
		setSelectedImages((prev) =>
			prev.filter(
				(img) => img.source !== "uploaded" && img.source !== "uploaded-local"
			)
		);
	};

	const removeImage = (imageId) => {
		setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
		setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
		addLog("🗑️ Image removed", "info");
	};

	const downloadSelectedImages = async () => {
		const selectedUploadedImages = selectedImages.filter(
			(img) =>
				(img.source === "uploaded" || img.source === "uploaded-local") &&
				!img.isLocal
		);

		if (selectedUploadedImages.length === 0) {
			addLog(
				"⚠️ No downloadable images selected (local-only images excluded)",
				"warning"
			);
			return;
		}

		addLog(
			`⬇️ Preparing to download ${selectedUploadedImages.length} images...`,
			"info"
		);

		try {
			const selectedFiles = selectedUploadedImages.map((selectedImg) => ({
				url: selectedImg.url,
				filename: selectedImg.name || `image-${selectedImg.id}.jpg`,
			}));

			const response = await axios.post(
				"https://pythonbackend-production-ab5d.up.railway.app/api/scrapers/download-zip",
				{
					files: selectedFiles,
					platform: platform,
				},
				{
					responseType: "blob",
					headers: {"Content-Type": "application/json"},
				}
			);

			const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.setAttribute(
				"download",
				`uploaded-images-${new Date().toISOString().split("T")[0]}.zip`
			);
			document.body.appendChild(link);
			link.click();
			link.remove();

			addLog("✅ ZIP file download started!", "success");
		} catch (error) {
			console.error("Error downloading ZIP:", error);
			addLog(
				"❌ Failed to create ZIP download. Falling back to individual downloads.",
				"error"
			);

			addLog("⚠️ Attempting individual downloads...", "info");
			selectedUploadedImages.forEach((selectedImg) => {
				const link = document.createElement("a");
				link.href = selectedImg.url;
				link.download = selectedImg.name || `image-${selectedImg.id}.jpg`;
				link.target = "_blank";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			});
			addLog("✅ Individual downloads started!", "success");
		}
	};

	const isImageSelected = (id) => {
		return selectedImages.some((selectedImg) => selectedImg.id === id);
	};

	// Count only processable uploaded images in selection
	const selectedUploadedCount = selectedImages.filter(
		(img) =>
			(img.source === "uploaded" || img.source === "uploaded-local") &&
			!img.isLocal
	).length;

	// Count local-only images
	const localOnlyCount = uploadedImages.filter((img) => img.isLocal).length;
	const processableCount = uploadedImages.filter((img) => !img.isLocal).length;

	return (
		<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				multiple
				onChange={handleFileInputChange}
				className="hidden"
			/>

			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div className="flex-1">
					<h2 className="text-2xl font-bold text-white flex items-center gap-2">
						<Upload className="w-6 h-6 text-purple-400" />
						Image Upload
					</h2>
					<p className="text-gray-400 text-sm mt-1">
						Upload your own images for processing
					</p>
				</div>
			</div>

			{/* Local images warning */}
			{localOnlyCount > 0 && (
				<div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3 mb-6">
					<AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
					<div>
						<p className="text-yellow-300 font-medium">
							{localOnlyCount} image(s) stored locally only
						</p>
						<p className="text-yellow-200/80 text-sm mt-1">
							These images cannot be processed by the backend. Click the retry
							button on each image to upload to the server.
						</p>
					</div>
				</div>
			)}

			{/* Upload Section */}
			<div className="mb-6">
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={triggerFileInput}
					className={`
						relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
						transition-all duration-300 
						${
							dragOver
								? "border-purple-400 bg-purple-500/20"
								: "border-white/20 hover:border-white/40 hover:bg-white/5"
						}
						${isUploading ? "pointer-events-none opacity-70" : ""}
					`}
				>
					{isUploading ? (
						<div className="flex flex-col items-center gap-3">
							<Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
							<div className="w-full max-w-xs">
								<div className="flex justify-between text-sm text-gray-300 mb-1">
									<span>Uploading...</span>
									<span>{uploadProgress}%</span>
								</div>
								<div className="w-full bg-gray-700 rounded-full h-2">
									<div
										className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
										style={{width: `${uploadProgress}%`}}
									/>
								</div>
							</div>
						</div>
					) : (
						<>
							<div className="flex flex-col items-center gap-4">
								<div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
									<Upload className="w-8 h-8 text-purple-400" />
								</div>
								<div>
									<p className="text-white font-medium text-lg">
										{dragOver ? "Drop images here" : "Upload your images"}
									</p>
									<p className="text-gray-400 text-sm mt-2">
										Drag & drop or click to browse
									</p>
									<p className="text-gray-500 text-xs mt-1">
										JPG, PNG, WebP, GIF • Max 10MB per file
									</p>
								</div>
							</div>
							<button
								type="button"
								className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 inline-flex items-center gap-2"
								onClick={(e) => {
									e.stopPropagation();
									triggerFileInput();
								}}
							>
								<Plus className="w-4 h-4" />
								Select Images
							</button>
						</>
					)}
				</div>
			</div>

			{/* Actions - Only show if there are uploaded images */}
			{uploadedImages.length > 0 && (
				<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
					<div className="flex items-center gap-3">
						<button
							onClick={toggleSelectAll}
							className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-colors"
							disabled={processableCount === 0}
						>
							<Check className="w-4 h-4" />
							{selectedUploadedCount === processableCount &&
							processableCount > 0
								? "Deselect All"
								: "Select All"}
						</button>
						<span className="text-sm text-gray-300">
							{selectedUploadedCount} of {processableCount} selected
							{localOnlyCount > 0 && (
								<span className="text-yellow-400 ml-1">
									({localOnlyCount} local only)
								</span>
							)}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={downloadSelectedImages}
							disabled={selectedUploadedCount === 0}
							className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
								selectedUploadedCount === 0
									? "bg-gray-600 text-gray-400 cursor-not-allowed"
									: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
							}`}
						>
							<Download className="w-4 h-4" />
							Download Selected
						</button>
						<button
							onClick={removeSelectedImages}
							disabled={selectedUploadedCount === 0}
							className={`p-2 rounded-lg transition-colors ${
								selectedUploadedCount === 0
									? "text-gray-600 cursor-not-allowed"
									: "text-red-400 hover:bg-red-500/20"
							}`}
							title="Remove selected"
						>
							<Trash2 className="w-5 h-5" />
						</button>
					</div>
				</div>
			)}

			{/* Image Grid */}
			{uploadedImages.length > 0 ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{uploadedImages.map((image) => (
						<div key={image.id} className="relative group">
							<div
								className={`relative bg-white/5 border-2 ${
									isImageSelected(image.id)
										? "border-purple-400 shadow-lg shadow-purple-400/20"
										: image.isLocal
										? "border-yellow-500/50"
										: "border-transparent hover:border-white/30"
								} rounded-xl overflow-hidden transition-all duration-300 hover:scale-105`}
							>
								<div className="aspect-square bg-gray-800/50 flex items-center justify-center">
									<img
										src={image.url}
										alt={image.name}
										className="w-full h-full object-contain p-2"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src =
												"data:image/svg+xml;charset=UTF-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%232d3748'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='10' text-anchor='middle' alignment-baseline='middle' fill='%236b7280'%3EImage%3C/text%3E%3C/svg%3E";
										}}
									/>
								</div>

								{/* Status badge */}
								<div className="absolute top-2 right-2 z-10">
									{image.isLocal ? (
										<span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-yellow-500/80 text-yellow-900">
											Local Only
										</span>
									) : (
										<span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-green-500/80 text-green-900">
											Uploaded
										</span>
									)}
								</div>

								{/* Hover overlay */}
								<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
									<button
										className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
										onClick={(e) => {
											e.stopPropagation();
											window.open(image.url, "_blank");
										}}
										title="Preview"
									>
										<ImageIcon className="w-4 h-4 text-white" />
									</button>
									{image.isLocal ? (
										<button
											className="p-2 bg-yellow-500/80 backdrop-blur-sm rounded-lg hover:bg-yellow-500 transition-colors"
											onClick={(e) => {
												e.stopPropagation();
												retryUpload(image.id);
											}}
											title="Retry Upload"
										>
											<Loader2 className="w-4 h-4 text-white" />
										</button>
									) : (
										<button
											className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
											onClick={async (e) => {
												e.stopPropagation();
												try {
													const response = await fetch(image.url, {
														mode: "cors",
													});
													const blob = await response.blob();
													const blobUrl = window.URL.createObjectURL(blob);

													const link = document.createElement("a");
													link.href = blobUrl;
													link.download = image.name || "image.jpg";
													document.body.appendChild(link);
													link.click();
													link.remove();

													window.URL.revokeObjectURL(blobUrl);
												} catch (error) {
													console.error("Error downloading image:", error);
													window.open(image.url, "_blank");
												}
											}}
											title="Download"
										>
											<Download className="w-4 h-4 text-white" />
										</button>
									)}
									<button
										className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-500 transition-colors"
										onClick={(e) => {
											e.stopPropagation();
											removeImage(image.id);
										}}
										title="Remove"
									>
										<Trash2 className="w-4 h-4 text-white" />
									</button>
								</div>

								{/* Checkbox */}
								<div className="absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center bg-black/50 rounded">
									<input
										type="checkbox"
										checked={isImageSelected(image.id)}
										onChange={(e) => {
											e.stopPropagation();
											toggleImageSelection(image.id);
										}}
										className="w-4 h-4 text-purple-500 rounded border-gray-300 focus:ring-purple-400 cursor-pointer"
									/>
								</div>

								{/* Caption */}
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
									<p
										className="text-xs text-white font-medium truncate"
										title={image.name}
									>
										{image.name}
									</p>
									<div className="flex justify-between items-center">
										<span className="text-[10px] text-gray-500">
											{image.size}
										</span>
										{image.isLocal && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													retryUpload(image.id);
												}}
												className="text-[10px] px-1.5 py-0.5 bg-yellow-500/80 hover:bg-yellow-500 rounded text-yellow-900 font-medium"
											>
												Retry
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div
					className={`text-center py-16 bg-white/5 rounded-xl border-2 border-dashed transition-colors duration-300 ${
						dragOver ? "border-purple-400 bg-purple-500/10" : "border-white/10"
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-300 mb-1">
						No images uploaded yet
					</h3>
					<p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
						Upload your own images to get started with processing
					</p>
					<button
						onClick={triggerFileInput}
						className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 inline-flex items-center gap-2"
					>
						<Upload className="w-4 h-4" />
						Upload Images
					</button>
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
