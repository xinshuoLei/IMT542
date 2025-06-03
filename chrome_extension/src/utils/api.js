const API_BASE_URL = 'http://localhost:8000';

export async function fetchNpmMetadata(packageName) {
  try {
    const response = await fetch(`${API_BASE_URL}/npm/metadata/${packageName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching npm metadata:', error);
    throw error;
  }
}

export async function fetchNpmDownloads(packageName) {
  try {
    const response = await fetch(`${API_BASE_URL}/npm/downloads/${packageName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching npm downloads:', error);
    throw error;
  }
}