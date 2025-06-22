class UploadSection {
  constructor(containerId, baseUrl) {
    this.container = $(containerId);
    this.baseUrl = baseUrl;
    this.loadingIndicator = null;
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
    this.addVideoErrorHandling(); // Add this line
  }

  bindEvents() {
    $('#upload-btn').click(() => {
      const file = $('#video-upload')[0].files[0];
      if (!file) {
        this.showMessage('請選擇影片', 'alert');
        return;
      }

      this.loadingIndicator.removeClass('hidden').text('上傳中: 0.00%');
      const formData = new FormData();
      formData.append("file", file);

      $.ajax({
        url: `${this.baseUrl}/upload`,
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        xhr: function() {
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
          this.loadingIndicator.addClass('hidden');
          this.showMessage("上傳成功！影片處理完成。", 'success');
          const videoId = res.video_id;
          const processedVideoUrl = this.baseUrl + res.processed_video_url;
          localStorage.setItem("video_id", videoId);
          
          const videoPlayer = $('#video-player')[0];
          videoPlayer.src = processedVideoUrl;
          videoPlayer.load(); // Reload the video element to play new source
          // videoPlayer.play() will be called after 'loadeddata' or 'canplaythrough'

          $(document).trigger('videoProcessed', { videoId: videoId, poseData: res.pose_data });
        },
        error: (xhr, status, error) => {
          this.loadingIndicator.addClass('hidden');
          console.error("上傳失敗：", error, xhr.responseText);
          this.showMessage(`上傳失敗，請重試。錯誤: ${error} - ${xhr.responseText}`, 'error');
        },
        complete: () => {
          this.loadingIndicator.text('影片處理中，請稍候...');
        }
      });
    });
  }

  addVideoErrorHandling() {
    const videoPlayer = $('#video-player')[0];
    if (videoPlayer) {
      videoPlayer.onerror = (e) => {
        console.error('Video load error:', e);
        this.showMessage('影片載入失敗，可能影片格式不支援或檔案損壞。', 'error');
        // 您也可以嘗試提供原始影片作為備用
        // const videoId = localStorage.getItem("video_id");
        // if (videoId) {
        //   videoPlayer.src = `${this.baseUrl}/static/videos/${videoId}.mp4`; // Assuming original was also mp4
        //   videoPlayer.load();
        //   this.showMessage('載入處理過的影片失敗，嘗試載入原始影片。', 'info');
        // }
      };

      // Ensure autoplay after enough data is loaded
      videoPlayer.oncanplaythrough = () => {
        videoPlayer.play().catch(e => {
          console.error('Video autoplay failed:', e);
          this.showMessage('影片自動播放失敗，請點擊播放按鈕。', 'info');
        });
      };
    }
  }

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

    setTimeout(() => {
      messageBox.removeClass('opacity-100').addClass('opacity-0');
    }, 5000);
  }
}
window.UploadSection = UploadSection;
