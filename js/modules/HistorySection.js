class HistorySection {
  constructor(containerId, baseUrl) {
    this.container = $(containerId);
    this.baseUrl = baseUrl;
  }

  render() {
    this.container.html(`
      <h2 class="text-xl font-semibold mb-4">🕒 歷史紀錄</h2>
      <ul id="history-list" class="text-sm text-gray-600 space-y-2 max-h-60 overflow-y-auto"></ul>
    `);
    this.fetchHistory();
  }

  fetchHistory() {
    $.get(`${this.baseUrl}/history`, (res) => {
      const html = res.history.map(item => `
        <li>${item.timestamp} - ${item.filename} - ${item.result}</li>
      `).join('');
      $('#history-list').html(html);
    });
  }
}
window.HistorySection = HistorySection;
