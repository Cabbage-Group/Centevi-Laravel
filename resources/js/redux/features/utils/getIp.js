

async function getIp() {
  try {

    const ip_cache = localStorage.getItem('ip');
    // if (ip_cache) {
    //   return ip_cache;
    // }

    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const ip = data.ip;
    localStorage.setItem('ip', ip);
    return ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    throw error;
  }
}

export default getIp;
