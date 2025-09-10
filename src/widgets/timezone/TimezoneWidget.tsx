import { useEffect, useState } from "preact/hooks";

export const TimezoneWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timezones = [
    {
      name: "Vietnam",
      timezone: "Asia/Ho_Chi_Minh",
      flag: "🇻🇳",
      abbr: "ICT"
    },
    {
      name: "Seattle",
      timezone: "America/Los_Angeles",
      flag: "🇺🇸",
      abbr: "PST/PDT"
    },
    {
      name: "London",
      timezone: "Europe/London",
      flag: "🇬🇧",
      abbr: "GMT/BST"
    },
    {
      name: "Sydney",
      timezone: "Australia/Sydney",
      flag: "🇦🇺",
      abbr: "AEST/AEDT"
    }
  ];

  const formatTime = (timezone: string) => {
    return currentTime.toLocaleString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  };

  const formatDate = (timezone: string) => {
    return currentTime.toLocaleDateString("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const copyTime = async (timezone: string, name: string) => {
    const time = formatTime(timezone);
    const date = formatDate(timezone);
    const timeString = `${name}: ${date} ${time}`;
    
    try {
      await navigator.clipboard.writeText(timeString);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div class="h-full flex flex-col space-y-3">
      {timezones.map((tz) => (
        <div
          key={tz.timezone}
          class="bg-base-200 p-3 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
          onClick={() => copyTime(tz.timezone, tz.name)}
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="text-lg">{tz.flag}</span>
              <span class="text-sm font-semibold text-base-content">
                {tz.name}
              </span>
            </div>
            <span class="text-xs text-base-content/60">{tz.abbr}</span>
          </div>
          
          <div class="font-mono text-lg font-bold text-base-content">
            {formatTime(tz.timezone)}
          </div>
          
          <div class="text-xs text-base-content/70">
            {formatDate(tz.timezone)}
          </div>
        </div>
      ))}
      
      <div class="text-xs text-base-content/50 text-center mt-2">
        Click any timezone to copy
      </div>
    </div>
  );
};
