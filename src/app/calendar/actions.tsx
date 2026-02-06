'use server'

export async function getCalendarData() {
    const apiUrl = process.env.CMS_CALENDAR_URL!;
    const calendarResponse =  await fetch(apiUrl);
    const calendarData = await calendarResponse.json();
    console.log(calendarData)
    return calendarData;
}

