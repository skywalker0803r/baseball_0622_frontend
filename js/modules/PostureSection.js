class PostureSection {
  constructor(containerId, baseUrl) {
    this.container = $(containerId);
    this.baseUrl = baseUrl;
  }

  render() {
    this.container.html(`
      <h2 class="text-xl font-semibold mb-4">✅ 姿勢評估</h2>
      <ul class="text-gray-700 space-y-2">
        <li>🦵 步幅角度：<span id="stride-angle">--°</span></li>
        <li>💪 投擲角度：<span id="throwing-angle">--°</span></li>
        <li>🔁 手臂對稱性：<span id="arm-symmetry">--%</span></li>
        <li>🌀 髖部旋轉：<span id="hip-rotation">--°</span></li>
        <li>📏 手肘高度：<span id="elbow-height">--px</span></li>
      </ul>
    `);
    this.fetchData();
  }

  fetchData() {
    const videoId = localStorage.getItem("video_id");
    if (!videoId) return;

    $.get(`${this.baseUrl}/analysis/${videoId}`, (res) => {
      $('#stride-angle').text(res.stride_angle + '°');
      $('#throwing-angle').text(res.throwing_angle + '°');
      $('#arm-symmetry').text(res.arm_symmetry + '%');
      $('#hip-rotation').text(res.hip_rotation + '°');
      $('#elbow-height').text(res.elbow_height + 'px');
    });
  }
}
window.PostureSection = PostureSection;
