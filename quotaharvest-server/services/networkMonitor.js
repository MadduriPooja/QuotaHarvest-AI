const si = require('systeminformation');

const DAILY_LIMIT_MB = 1500; // 1.5 GB default plan

async function getNetworkStatus() {
  try {
    const stats = await si.networkStats();
    const rxBytes = stats && stats[0] ? stats[0].rx_bytes : 0;
    const usedMB = (rxBytes / (1024 * 1024)).toFixed(2);
    const remainingMB = Math.max(0, (DAILY_LIMIT_MB - usedMB)).toFixed(2);

    return {
      dailyLimitMB: DAILY_LIMIT_MB,
      usedMB: parseFloat(usedMB),
      remainingMB: parseFloat(remainingMB)
    };
  } catch (error) {
    console.error('Error fetching network stats:', error.message);
    return {
      dailyLimitMB: DAILY_LIMIT_MB,
      usedMB: 0,
      remainingMB: DAILY_LIMIT_MB
    };
  }
}

module.exports = { getNetworkStatus };