window.CMX_DAILY_WEATHER = {
  generated: "Updated August 3, 2026 for Brooklyn and August 3-4, 2026 for Waikato",
  brooklyn: {
    id: "brooklyn",
    audience: "jay",
    priority: 100,
    label: "Brooklyn · Monday afternoon",
    shortLabel: "Brooklyn",
    location: "Brooklyn, New York",
    period: "Monday afternoon",
    status: "FORECAST",
    title: "Warm, humid, with a passing-shower chance",
    condition: "Bright with scattered clouds",
    temperature: 82,
    unit: "F",
    feelsLike: 85,
    high: 84,
    low: 72,
    rain: 18,
    wind: "9 mph",
    sunset: "8:09 PM",
    bestWindow: "5:30–7:30 PM",
    visual: "sun-cloud",
    text: "Brooklyn is warm and humid this afternoon. A passing shower remains possible, but the evening should become more comfortable for walking, errands, or movement.",
    advice: "Use the cooler early-evening window. Carry water and check radar before a longer trip.",
    items: [
      "Best window: early evening once the temperature begins backing off.",
      "Carry water and a light rain layer if you will be out for several hours.",
      "Tuesday trends drier and a little warmer, with more sunshine likely."
    ],
    hourly: [
      { time: "Now", temp: 82, condition: "Bright", rain: 12, wind: "9 mph", note: "Warm and humid" },
      { time: "2 PM", temp: 83, condition: "Sun + cloud", rain: 18, wind: "10 mph", note: "Brief shower possible" },
      { time: "4 PM", temp: 82, condition: "Mixed sky", rain: 24, wind: "10 mph", note: "Watch the radar" },
      { time: "6 PM", temp: 79, condition: "Clearing", rain: 12, wind: "8 mph", note: "Better outdoor window" },
      { time: "8 PM", temp: 76, condition: "Mostly clear", rain: 7, wind: "6 mph", note: "Comfortable after sunset" },
      { time: "10 PM", temp: 73, condition: "Calm", rain: 5, wind: "4 mph", note: "Warm night" }
    ],
    outlook: [
      { day: "Today", high: 84, low: 72, condition: "Mixed", rain: 24 },
      { day: "Tue", high: 85, low: 73, condition: "Sunny", rain: 12 },
      { day: "Wed", high: 81, low: 70, condition: "Showers", rain: 48 },
      { day: "Thu", high: 82, low: 69, condition: "Clear", rain: 14 }
    ],
    whyItMatters: "The day is usable, but a brief shower could interrupt outdoor plans and slow travel.",
    watchNext: "Check the radar before a longer trip because downpours may be uneven across the city.",
    sources: [
      { label: "Brooklyn hourly forecast", url: "https://www.timeanddate.com/weather/usa/brooklyn/hourly", published: "August 3 hourly outlook" },
      { label: "National Weather Service New York", url: "https://www.weather.gov/okx/", published: "current forecast office" }
    ]
  },
  waikato: {
    id: "waikato",
    audience: "crystal",
    priority: 99,
    label: "Waikato · Tuesday pre-dawn",
    shortLabel: "Waikato",
    location: "Hamilton, Waikato",
    period: "Tuesday pre-dawn",
    status: "FORECAST",
    title: "Cold start, brighter and easier later",
    condition: "Clear and cold",
    temperature: 5,
    unit: "C",
    feelsLike: 3,
    high: 15,
    low: 4,
    rain: 9,
    wind: "7 km/h",
    sunset: "5:33 PM",
    bestWindow: "11:00 AM–3:00 PM",
    visual: "moon-cold",
    text: "Hamilton is cold before sunrise, then Tuesday should recover into the mid-teens with light wind and limited rain risk.",
    advice: "Layers first. Late morning through mid-afternoon is the better window for a run, walk, errands, or the route with the good view.",
    items: [
      "Best window Tuesday: late morning through mid-afternoon.",
      "The morning will feel much colder than the afternoon.",
      "Wednesday may bring more cloud and a higher shower chance."
    ],
    hourly: [
      { time: "Now", temp: 5, condition: "Clear", rain: 4, wind: "7 km/h", note: "Cold before sunrise" },
      { time: "7 AM", temp: 5, condition: "Frosty", rain: 4, wind: "6 km/h", note: "Watch shaded surfaces" },
      { time: "9 AM", temp: 8, condition: "Bright", rain: 5, wind: "7 km/h", note: "Still layer weather" },
      { time: "11 AM", temp: 12, condition: "Sunny", rain: 6, wind: "8 km/h", note: "Good movement window" },
      { time: "1 PM", temp: 15, condition: "Mostly sunny", rain: 8, wind: "9 km/h", note: "Best part of the day" },
      { time: "3 PM", temp: 14, condition: "Light cloud", rain: 10, wind: "8 km/h", note: "Still workable outside" }
    ],
    outlook: [
      { day: "Tue", high: 15, low: 4, condition: "Bright", rain: 9 },
      { day: "Wed", high: 14, low: 7, condition: "Clouds", rain: 34 },
      { day: "Thu", high: 13, low: 6, condition: "Showers", rain: 52 },
      { day: "Fri", high: 15, low: 5, condition: "Mixed", rain: 22 }
    ],
    whyItMatters: "Outdoor movement looks workable, but the cold start and quick evening cooldown are the real planning factors.",
    watchNext: "Watch for frost on shaded surfaces early Tuesday and reassess if cloud thickens faster than expected.",
    sources: [
      { label: "Hamilton hourly forecast", url: "https://www.timeanddate.com/weather/%402190325/hourly", published: "August 3-4 hourly outlook" },
      { label: "MetService Hamilton", url: "https://www.metservice.com/towns-cities/locations/hamilton", published: "current local forecast" }
    ]
  }
};
