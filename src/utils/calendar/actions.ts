'use server';

const fetchHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
      return 'Connection timed out. Please check your internet connection and try again.';
    }
    if (error.message.includes('ECONNREFUSED')) {
      return 'Server is unavailable. Please try again later.';
    }
    if (error.message.includes('NetworkError') || error.message.includes('network')) {
      return 'Network error. Please check your internet connection.';
    }
  }
  return 'Unable to load events. Please try again later.';
}

export async function getCalendarData() {
  try {
    const apiUrl = process.env.CMS_CALENDAR_URL;
    if (!apiUrl) {
      console.error('CMS_CALENDAR_URL is not configured');
      return { data: [], error: 'Events are temporarily unavailable. Configuration error.' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const calendarResponse = await fetch(apiUrl, { 
      headers: fetchHeaders,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!calendarResponse.ok) {
      console.error(`Calendar API error: ${calendarResponse.status} ${calendarResponse.statusText}`);
      if (calendarResponse.status === 503) {
        return { data: [], error: 'Server is temporarily unavailable. Please try again later.' };
      }
      if (calendarResponse.status === 500) {
        return { data: [], error: 'Server error. Please try again later.' };
      }
      if (calendarResponse.status === 404) {
        return { data: [], error: 'Events not found. Please try again later.' };
      }
      return { data: [], error: 'Unable to load events. Please try again later.' };
    }

    const calendarData = await calendarResponse.json();
    return calendarData;
  } catch (error: unknown) {
    console.error('Error fetching calendar data:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: [], error: 'Request timed out. Please check your internet connection and try again.' };
    }
    
    return { data: [], error: getErrorMessage(error) };
  }
}
