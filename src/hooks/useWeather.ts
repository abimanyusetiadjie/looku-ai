import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  isSimulated: boolean; // true jika user menolak akses lokasi, fallback ke data Jakarta
}

// Mapping WMO Weather Code dari Open-Meteo ke Bahasa Indonesia
const weatherCodeMap: Record<number, string> = {
  0: "Cerah",
  1: "Cerah Berawan",
  2: "Berawan",
  3: "Mendung",
  45: "Berkabut",
  48: "Kabut Tebal",
  51: "Gerimis Ringan",
  53: "Gerimis Sedang",
  55: "Gerimis Lebat",
  61: "Hujan Ringan",
  63: "Hujan Sedang",
  65: "Hujan Lebat",
  80: "Hujan Badai",
  95: "Badai Petir",
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 33, // Default fallback
    condition: "Tropis Siang Hari",
    location: "JAKARTA",
    isSimulated: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        // 1. Fetch Cuaca dari Open-Meteo (Gratis, tanpa API Key)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        );
        const weatherData = await weatherRes.json();
        
        // 2. Fetch Nama Kota dari Nominatim OpenStreetMap (Gratis, Reverse Geocoding)
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
        );
        const geoData = await geoRes.json();
        
        if (mounted) {
          const temp = Math.round(weatherData.current.temperature_2m);
          const code = weatherData.current.weather_code;
          const conditionStr = weatherCodeMap[code] || "Berawan";
          
          // Ambil nama kota atau kabupaten
          let city = geoData.address?.city || geoData.address?.town || geoData.address?.county || "LOKASI ANDA";
          
          setWeather({
            temperature: temp,
            condition: conditionStr,
            location: city.toUpperCase(),
            isSimulated: false,
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Gagal mengambil data cuaca realtime:", err);
        if (mounted) {
          setError("Gagal terhubung ke satelit cuaca. Menggunakan data simulasi.");
          setIsLoading(false);
        }
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Akses lokasi ditolak, menggunakan fallback Jakarta.", err);
          if (mounted) {
            setError("Akses lokasi ditolak. Menggunakan suhu simulasi Jakarta.");
            setIsLoading(false);
          }
        },
        { timeout: 10000 }
      );
    } else {
      if (mounted) {
        setError("Geolokasi tidak didukung browser ini.");
        setIsLoading(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { weather, isLoading, error };
}
