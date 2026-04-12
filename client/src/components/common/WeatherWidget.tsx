import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Clock } from 'lucide-react';

export default function WeatherWidget() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number; code: number; city: string } | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather data based on coordinates
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number, cityName: string = 'Jakarta') => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          code: data.current_weather.weathercode,
          city: cityName
        });
      } catch (error) {
        console.error('Failed to fetch weather', error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Reverse geocoding to get city name
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || 'Lokasi';
            fetchWeather(lat, lon, city);
          } catch {
            fetchWeather(lat, lon, 'Lokasi Anda');
          }
        }, () => {
          // Fallback if denied
          fetchWeather(-6.2088, 106.8456, 'Jakarta');
        });
      } else {
        fetchWeather(-6.2088, 106.8456, 'Jakarta');
      }
    };

    getLocation();
    const interval = setInterval(getLocation, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-3.5 w-3.5" />;
    if (code <= 3) return <Cloud className="h-3.5 w-3.5" />;
    if (code >= 51 && code <= 67) return <CloudRain className="h-3.5 w-3.5" />;
    if (code >= 95) return <CloudLightning className="h-3.5 w-3.5" />;
    return <Cloud className="h-3.5 w-3.5" />;
  };

  const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(time);
  const dateFormatted = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(time);
  const timeFormatted = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="hidden items-center gap-4 text-[10px] font-medium tracking-widest text-muted-foreground/80 sm:flex">
      <div className="flex items-center gap-2 border-r pr-4 border-border/50">
        <Clock className="h-3 w-3 opacity-70" />
        <span className="uppercase">{dayName}, {dateFormatted}</span>
        <span className="tabular-nums opacity-70">{timeFormatted}</span>
      </div>
      
      {weather && (
        <div className="flex items-center gap-2 animate-in fade-in duration-700">
          {getWeatherIcon(weather.code)}
          <div className="flex items-center gap-1 uppercase">
            <span>{weather.temp}°C</span>
            <span className="opacity-40 text-[9px] tracking-tighter">{weather.city}</span>
          </div>
        </div>
      )}
    </div>
  );
}
