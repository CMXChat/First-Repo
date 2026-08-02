# Daily Weather Rules

Target section: `weather`
Daily weather data: `assets/daily-weather.js`

## Purpose

Give Jay and Crystal a concise, genuinely useful forecast for both places every day. The section must answer what the weather is doing, what changes later, what tomorrow looks like, and what each person can realistically do with that information.

## Required locations and dates

- Brooklyn, New York using the actual Brooklyn local date and time.
- Hamilton or the confirmed Waikato location using the actual Pacific/Auckland local date and time.
- The two cards may describe different calendar dates because Brooklyn and Waikato are in different time zones.

## Research requirements

Research weather fresh during every daily run. Prefer dedicated forecast tools and official services such as the National Weather Service for New York and MetService for New Zealand. Use a second reputable forecast source when useful to confirm timing or hourly detail.

Never publish placeholders such as:

- Check the sky before the plan.
- Use the live forecast.
- Check the weather before going out.

Do not present old observations as current. Clearly distinguish a current observation, hourly forecast and daily outlook.

## Required content for each card

Keep each card concise but include:

- Location and local daypart or date
- Current or near-current condition when available
- Expected high and low
- Rain or snow probability and likely timing
- Wind direction and useful speed range
- Sunset when it affects plans
- One best outdoor window or practical activity idea
- One clothing, travel or safety note when relevant
- A short one-to-three-day outlook
- At least one direct forecast source, with two sources preferred when meaningful

Use Fahrenheit first for Brooklyn. Use Celsius first for Waikato. A secondary conversion is optional and usually unnecessary.

## Activity guidance

Suggestions should follow the data. Examples include:

- Best walking or running window
- Whether to carry a light rain layer
- Whether heat, humidity, frost, wind or early darkness changes the plan
- An indoor fallback when rain is likely
- A reminder to use the route with the good view when conditions support it

Do not turn the section into generic wellness advice. Keep the recommendation tied to the actual forecast.

## File contract

Update `assets/daily-weather.js` with valid UTF-8 JavaScript beginning exactly with:

`window.CMX_DAILY_WEATHER = {`

and ending with:

`};`

Use top-level keys:

- `generated`
- `brooklyn`
- `waikato`

Each location card should use the existing briefing-card fields such as:

- `audience`
- `priority`
- `label`
- `status`
- `title`
- `text`
- `items`
- `whyItMatters`
- `watchNext`
- `sources`

Store only daily weather data in this file. Do not add rendering or loader logic.

## Validation

After publishing:

- Confirm both location cards exist.
- Confirm the local dates are correct for both time zones.
- Confirm all numbers agree with the cited forecast sources.
- Confirm the page loads `daily-weather.js` before `news.js` renders.
- Confirm no previous day's weather remains visible.
