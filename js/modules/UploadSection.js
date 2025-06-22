class UploadSection {
  constructor(containerId, baseUrl) {
    this.container = $(containerId);
    this.baseUrl = baseUrl;
    this.loadingIndicator = null; // Used to store the loading indicator element
  }

  render() {
    this.container.html(`
      <h2 class="text-xl font-semibold mb-4">🎥 影片上傳</h2>
      <input id="video-upload" type="file" accept="video/*" class="block w-full p-2 border border-gray-300 rounded" />
      <button id="upload-btn" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">上傳影片</button>
      <div id="upload-loading-indicator" class="hidden mt-4 text-center text-blue-600 font-semibold">
        影片處理中，請稍候...
      </div>
      <div id="app-message-box" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300 opacity-0"></div>
    `);
    this.loadingIndicator = $('#upload-loading-indicator');
    this.bindEvents();
  }

  bindEvents() {
    $('#upload-btn').click(() => {
      const file = $('#video-upload')[0].files[0];
      if (!file) {
        this.showMessage('請選擇影片', 'alert');
        return;
      }

      this.loadingIndicator.removeClass('hidden').text('上傳中: 0.00%'); // 顯示載入指示器並重置文字
      const formData = new FormData();
      formData.append("file", file);

      $.ajax({
        url: `${this.baseUrl}/upload`,
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        xhr: function() { // Add progress event listener
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    const percentComplete = (evt.loaded / evt.total) * 100;
                    $('#upload-loading-indicator').text(`上傳中: ${percentComplete.toFixed(2)}%`);
                }
            }, false);
            return xhr;
        },
        success: (res) => {
          this.loadingIndicator.addClass('hidden'); // Hide loading indicator
          this.showMessage("上傳成功！影片處理完成。", 'success');
          const videoId = res.video_id;
          const processedVideoUrl = this.baseUrl + res.processed_video_url;
          localStorage.setItem("video_id", videoId);
          $('#video-player').attr('src', processedVideoUrl);
          $('#video-player')[0].load(); // Reload the video element to play new source
          $('#video-player')[0].play(); // Autoplay the processed video

          // Trigger custom event for other sections to listen and update
          $(document).trigger('videoProcessed', { videoId: videoId, poseData: res.pose_data });
        },
        error: (xhr, status, error) => {
          this.loadingIndicator.addClass('hidden'); // Hide loading indicator
          console.error("上傳失敗：", error, xhr.responseText);
          this.showMessage(`上傳失敗，請重試。錯誤: ${error} - ${xhr.responseText}`, 'error');
        },
        complete: () => {
          // Reset text to default message after completion (success or error)
          this.loadingIndicator.text('影片處理中，請稍候...');
        }
      });
    });
  }

  // Custom message box, replacing alert()
  showMessage(message, type = 'info') {
    const messageDivId = 'app-message-box';
    let messageBox = $(`#${messageDivId}`);

    let bgColor = 'bg-blue-500';
    if (type === 'success') {
      bgColor = 'bg-green-500';
    } else if (type === 'error' || type === 'alert') {
      bgColor = 'bg-red-500';
    }

    messageBox.removeClass('bg-blue-500 bg-green-500 bg-red-500').addClass(bgColor).html(message);
    messageBox.removeClass('opacity-0').addClass('opacity-100');

    // Automatically hide message after a few seconds
    setTimeout(() => {
      messageBox.removeClass('opacity-100').addClass('opacity-0');
    }, 5000); // Hide after 5 seconds
  }
}
window.UploadSection = UploadSection;
