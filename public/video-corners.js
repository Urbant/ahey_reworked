/* Round the actual picture inside object-fit: contain, not its surrounding tile. */
"use strict";
(() => {
	const videos = new Set();
	const roundPicture = (video) => {
		if (!video.videoWidth || !video.videoHeight) return;
		const style = getComputedStyle(video);
		const left = parseFloat(style.paddingLeft) || 0;
		const right = parseFloat(style.paddingRight) || 0;
		const top = parseFloat(style.paddingTop) || 0;
		const bottom = parseFloat(style.paddingBottom) || 0;
		const width = video.clientWidth - left - right;
		const height = video.clientHeight - top - bottom;
		if (width <= 0 || height <= 0) return;
		const scale = Math.min(width / video.videoWidth, height / video.videoHeight);
		const x = Math.max(0, (width - video.videoWidth * scale) / 2);
		const y = Math.max(0, (height - video.videoHeight * scale) / 2);
		video.style.clipPath = `inset(${top + y}px ${right + x}px ${bottom + y}px ${left + x}px round 12px)`;
	};
	const resizeObserver = new ResizeObserver((entries) => entries.forEach(({ target }) => roundPicture(target)));
	const onVideoResize = (event) => roundPicture(event.currentTarget);
	const sync = () => {
		for (const video of videos) {
			if (!video.isConnected) {
				resizeObserver.unobserve(video);
				video.removeEventListener("loadedmetadata", onVideoResize);
				video.removeEventListener("resize", onVideoResize);
				videos.delete(video);
			}
		}
		document.querySelectorAll("#videos video").forEach((video) => {
			if (videos.has(video)) return;
			videos.add(video);
			resizeObserver.observe(video);
			video.addEventListener("loadedmetadata", onVideoResize);
			video.addEventListener("resize", onVideoResize);
			roundPicture(video);
		});
	};
	const app = document.getElementById("app");
	if (app) {
		new MutationObserver(sync).observe(app, { childList: true, subtree: true });
		sync();
	}
})();
