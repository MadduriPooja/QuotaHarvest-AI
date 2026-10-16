const cron = require('node-cron');
const QueueItem = require('../models/QueueItem');
const { getNetworkStatus } = require('./networkMonitor');
const { downloadFile } = require('./downloader');

function initScheduler() {
  // '30 23 * * *' triggers every night at 11:30 PM (23:30)
  cron.schedule('30 23 * * *', async () => {
    console.log('[Scheduler] 11:30 PM threshold reached. Checking data balance...');
    
    const { remainingMB } = await getNetworkStatus();
    console.log(`[Scheduler] Remaining quota: ${remainingMB} MB`);

    if (remainingMB < 50) {
      console.log('[Scheduler] Buffer safety limit (<50MB). Halting downloads.');
      return;
    }

    const pendingItems = await QueueItem.find({ status: 'pending' });

    for (const item of pendingItems) {
      try {
        console.log(`[Scheduler] Downloading item: ${item.url}`);
        // Pass the title directly; downloader.js handles the extension now
        await downloadFile(item.url, item.title);

        item.status = 'downloaded';
        await item.save();
        console.log(`[Scheduler] Successfully downloaded: ${item.title}`);
      } catch (err) {
        console.error(`[Scheduler] Failed downloading ${item.url}:`, err.message);
        item.status = 'failed';
        await item.save();
      }
    }
  });
}

module.exports = { initScheduler };