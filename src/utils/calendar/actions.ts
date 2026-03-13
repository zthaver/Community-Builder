'use server';

export async function getCalendarData() {
  const apiUrl = process.env.CMS_CALENDAR_URL;

  if (!apiUrl) {
    console.error('CMS_CALENDAR_URL environment variable is not set');
    return { data: [], error: 'Calendar API URL not configured' };
  }

  try {
    const calendarResponse = await fetch(apiUrl);

    if (!calendarResponse.ok) {
      console.error(`Calendar API error: ${calendarResponse.status} ${calendarResponse.statusText}`);
      return { data: [], error: `API returned ${calendarResponse.status}` };
    }

    const contentType = calendarResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Calendar API did not return JSON. Content-Type:', contentType);
      return { data: [], error: 'API did not return JSON' };
    }

    const calendarData = await calendarResponse.json();
    return calendarData;
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return { data: [], error: 'Failed to fetch calendar data' };
  }
}
