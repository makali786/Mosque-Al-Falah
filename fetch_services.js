// Native fetch is available in Node 18+

async function fetchServices() {
  const baseUrl = 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/services?limit=100`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching services:', error);
  }
}

fetchServices();
