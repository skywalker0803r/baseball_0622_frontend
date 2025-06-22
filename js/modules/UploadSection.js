class UploadSection {
  constructor(containerId, baseUrl) {
    this.container = $(containerId);
    this.baseUrl = baseUrl;
  }

  render() {
    this.container.html(`
      <h2 class="text-xl font-semibold mb-4">🎥 影片上傳</h2>
      <input id="video-upload" type="file" accept="video/*" class="block w-full p-2 border border-gray-300 rounded" />
      <button id="upload-btn" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">上傳影片</button>
    `);
    this.bindEvents();
  }

  bindEvents() {
    $('#upload-btn').click(() => {
      const file = $('#video-upload')[0].files[0];
      if (!file) return alert('請選擇影片');

      const formData = new FormData();
      formData.append("file", file);

      $.ajax({
        url: `${this.baseUrl}/upload`,
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: (res) => {
          alert("上傳成功！");
          const videoId = res.video_id;
          const videoUrl = this.baseUrl + res.video_url;
          localStorage.setItem("video_id", videoId);
          $('#video-player').attr('src', videoUrl);
        },
        error: () => alert("上傳失敗，請重試。")
      });
    });
  }
}
window.UploadSection = UploadSection;
