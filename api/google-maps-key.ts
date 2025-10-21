export default function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the Google Maps API key from Vercel environment variables
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return res.status(500).json({ error: 'Google Maps API key not configured' });
  }

  // Return the API key
  res.status(200).json({ apiKey: googleMapsApiKey });
}