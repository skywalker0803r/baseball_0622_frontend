// 直接定義 BASE_URL，因為 process.env 在瀏覽器環境中不存在
// 如果您的後端在不同地址或埠，請修改這裡
const BASE_URL = "http://43.207.79.9:8000"; // ← 這是你的後端根路徑，請根據實際情況修改


$(function () {
  new UploadSection("#upload-section", BASE_URL).render();
  new VideoSection("#video-section").render();
  new PostureSection("#posture-section", BASE_URL).render();
  new PredictionSection("#prediction-section", BASE_URL).render();
  new HistorySection("#history-section", BASE_URL).render();
});
