const SINCA_API_URL = 'https://sinca.mma.gob.cl/index.php/json/listadomapa2k19/';

export async function fetchSincaData() {
  try {
    const response = await fetch(SINCA_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching SINCA data:', error);
    throw error;
  }
}