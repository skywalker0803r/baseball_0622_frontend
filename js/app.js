const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8000"; // ← 這是你的後端根路徑

$(function () {
  new UploadSection("#upload-section", BASE_URL).render();
  new VideoSection("#video-section").render();
  new PostureSection("#posture-section", BASE_URL).render();
  new PredictionSection("#prediction-section", BASE_URL).render();
  new HistorySection("#history-section", BASE_URL).render();
});