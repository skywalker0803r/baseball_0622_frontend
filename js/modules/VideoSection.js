class VideoSection {
  constructor(containerId) {
    this.container = $(containerId);
  }

  render() {
    this.container.html(`
      <h2 class="text-xl font-semibold mb-4">▶️ 影片播放</h2>
      <video id="video-player" class="w-full rounded" controls>
        <source src="" type="video/mp4" />
        您的瀏覽器不支援影片播放。
      </video>
    `);
  }
}
window.VideoSection = VideoSection;
