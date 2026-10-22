export type WeddingEvent = {
  id: 'bangleCeremony' | 'muhurtham' | 'reception';
  number: string;
  name: string;
  subtitle: string;
  date: string;
  start: string;
  end: string;
  venue: string;
  address: string;
  location: string;
  directionsUrl: string;
};

export const weddingData = {
  bride: 'Aruna',
  groom: 'Aravind',
  title: 'A Tale of Dawn & Lotus',
  tamilTitle: 'ஒரு புதிய தொடக்கம்',
  timezone: 'Asia/Kolkata',
  events: [
    { id: 'bangleCeremony', number: '01', name: 'Bangle Ceremony', subtitle: 'Colours of Celebration', date: '2026-11-13', start: '10:00', end: '12:00', venue: "At Bride's House", address: 'BTM 1st Stage, Bangalore', location: 'Bangalore, Karnataka', directionsUrl: 'https://maps.app.goo.gl/bx6TTd4iFnGp51B97' },
    { id: 'muhurtham', number: '02', name: 'Muhurtham', subtitle: 'The Sacred Beginning', date: '2026-11-15', start: '04:00', end: '06:00', venue: 'Veerabadra Swamy Devasthanam', address: 'Narasingapuram Street, Gugai, Salem, Tamil Nadu', location: 'Salem, Tamil Nadu', directionsUrl: 'https://maps.app.goo.gl/9giHBQXa9QtdnL9p8' },
    { id: 'reception', number: '03', name: 'Reception', subtitle: 'An Evening to Remember', date: '2026-11-16', start: '19:00', end: '21:30', venue: 'Theerthamalai Goundar Thirumana Maaligai', address: 'Karuppur Main Road, Vellakalpatti, Karuppur, Tamil Nadu 636012', location: 'Salem, Tamil Nadu', directionsUrl: 'https://maps.app.goo.gl/sUPqjrzfD1ZWpAgAA' },
  ] satisfies WeddingEvent[],
};

export function eventDate(event: WeddingEvent) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: weddingData.timezone }).format(new Date(`${event.date}T12:00:00+05:30`));
}
export function eventTime(event: WeddingEvent) {
  const format = (time: string) => new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: weddingData.timezone }).format(new Date(`${event.date}T${time}:00+05:30`));
  return `${format(event.start)} – ${format(event.end)}`;
}
export function eventTimestamp(event: WeddingEvent) { return new Date(`${event.date}T${event.start}:00+05:30`).getTime(); }
export function directionsUrl(event: WeddingEvent) { return event.directionsUrl; }
export function calendarUrl(event: WeddingEvent) {
  const stamp = (time: string) => `${event.date.replaceAll('-', '')}T${time.replace(':', '')}00`;
  const params = new URLSearchParams({ action: 'TEMPLATE', text: `${event.name} — ${weddingData.bride} & ${weddingData.groom}`, dates: `${stamp(event.start)}/${stamp(event.end)}`, ctz: weddingData.timezone, details: `Celebrate with ${weddingData.bride} and ${weddingData.groom}.`, location: event.address });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
