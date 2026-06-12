/**
 * Generate an .ics (iCalendar 2.0) file from SIARM timetable slots,
 * usable with Google Calendar, Apple Calendar, Outlook, Thunderbird.
 *
 * - One VEVENT per weekly slot, repeating until the end of the semester.
 * - All times are written in WAT (Africa/Douala, UTC+1).
 */

const DAYS = { Monday: 'MO', Tuesday: 'TU', Wednesday: 'WE', Thursday: 'TH', Friday: 'FR', Saturday: 'SA', Sunday: 'SU' }

function pad(n) { return String(n).padStart(2, '0') }

function nextDate(day) {
  // Return next date (as local Date) matching the given day name, after today.
  const idx = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
  if (idx < 0) return null
  const now = new Date()
  const diff = (idx - now.getDay() + 7) % 7 || 7
  const d = new Date(now)
  d.setDate(now.getDate() + diff)
  return d
}

function fmtICS(date, hh, mm) {
  // Produce YYYYMMDDTHHmmss in local time (no Z suffix → floating, then TZID specified separately)
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' + pad(hh) + pad(mm) + '00'
  )
}

function escapeIcs(str) {
  return String(str || '').replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n')
}

export function generateIcs(slots, opts = {}) {
  const { calName = 'IUGET Timetable', until = '2026-07-31' } = opts
  const dtstamp = fmtICS(new Date(), new Date().getHours(), new Date().getMinutes())
  const untilStr = until.replace(/-/g, '') + 'T235959'

  const events = []
  for (const slot of slots) {
    if (!slot.time || !slot.day || !slot.course) continue
    // "18:00 - 20:00" → ["18:00", "20:00"]
    const [startStr, endStr] = slot.time.split(/\s*-\s*/)
    if (!startStr || !endStr) continue
    const [sh, sm] = startStr.split(':').map(Number)
    const [eh, em] = endStr.split(':').map(Number)
    const start = nextDate(slot.day)
    if (!start) continue
    const dow = DAYS[slot.day]
    if (!dow) continue
    const uid = `${slot.course}-${slot.day}-${slot.time}-${slot.specialty || 'ALL'}@iuget.cm`
    const summary = `${slot.course} · ${slot.specialty || ''}`.trim()
    const desc = `Lecturer: ${slot.lecturer || 'TBA'}\\nRoom: ${slot.room || 'TBA'}\\nTrack: ${slot.track || 'bachelor-evening'}`
    events.push(
`BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;TZID=Africa/Douala:${fmtICS(start, sh, sm)}
DTEND;TZID=Africa/Douala:${fmtICS(start, eh, em)}
RRULE:FREQ=WEEKLY;BYDAY=${dow};UNTIL=${untilStr}
SUMMARY:${escapeIcs(summary)}
DESCRIPTION:${desc}
LOCATION:${escapeIcs(slot.room || 'IUGET Bonabéri')}
CATEGORIES:IUGET,SIARM,${slot.specialty || ''}
END:VEVENT`
    )
  }

  // Minimal VTIMEZONE block for Africa/Douala (UTC+1, no DST)
  const vtimezone =
`BEGIN:VTIMEZONE
TZID:Africa/Douala
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0100
TZOFFSETTO:+0100
TZNAME:WAT
END:STANDARD
END:VTIMEZONE`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SIARM//IUGET Bonabéri//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcs(calName)}`,
    'X-WR-TIMEZONE:Africa/Douala',
    vtimezone,
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(slots, fileName = 'iuget-timetable.ics', opts = {}) {
  const ics = generateIcs(slots, opts)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
