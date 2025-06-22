class PredictionSection {
  constructor(containerId, baseUrl) {
    this.container = $(containerId);
    this.baseUrl = baseUrl;
  }

  render() {
    this.container.html(`
      <h2 class="text-xl font-semibold mb-4">🤖 模型預測</h2>
      <div class="text-gray-700">
        <p>預測結果：<span id="model-result">--</span></p>
        <p>信心分數：<span id="confidence-score">--%</span></p>
      </div>
    `);
    this.fetchData();
  }

  fetchData() {
    const videoId = localStorage.getItem("video_id");
    if (!videoId) return;

    $.get(`${this.baseUrl}/predict/${videoId}`, (res) => {
      $('#model-result').text(res.result);
      $('#confidence-score').text((res.confidence * 100).toFixed(1) + '%');
    });
  }
}
window.PredictionSection = PredictionSection;
