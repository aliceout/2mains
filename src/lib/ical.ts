// Génération de fichiers iCalendar (RFC 5545) sans dépendance externe.
//
// Choix : on écrit les DTSTART/DTEND en « floating time » (sans TZ), c-à-d
// interprétés comme heure locale par le client. Les événements de l'asso se
// déroulent à Lyon, et les clients calendrier (Apple, Google, Thunderbird)
// affichent le floating time comme heure locale — OK pour la majorité des
// participant·es. Si on voulait être parfaitement rigoureux pour un·e
// utilisateur·ice à l'étranger, il faudrait ajouter un bloc VTIMEZONE
// Europe/Paris et préfixer par TZID=Europe/Paris ; on garde simple.
//
// Les dates du CMS arrivent en Date JS. Sur GitHub Actions (build en UTC), un
// champ `date_debut: 2026-05-15T14:00:00` (sans Z, sans offset) est parsé
// comme 14:00 UTC. Les getters UTC (getUTCHours etc.) donnent alors les
// composantes voulues pour reprojeter en floating time. En dev local (FR),
// ça décale de 1-2h mais on ne teste pas depuis dev.

export type IcsEvent = {
  uid: string;
  start: Date;
  end?: Date;
  summary: string;
  description?: string;
  location?: string;
  url?: string;
};

function escapeText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function formatFloating(d: Date): string {
  const y = d.getUTCFullYear();
  const M = String(d.getUTCMonth() + 1).padStart(2, '0');
  const D = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}${M}${D}T${h}${m}${s}`;
}

function formatUtcZ(d: Date): string {
  return formatFloating(d) + 'Z';
}

// Plie les lignes à 75 octets UTF-8 avec CRLF + espace de continuation,
// comme exigé par la RFC 5545.
function foldLine(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let buf = '';
  for (const ch of line) {
    const candidate = buf + ch;
    if (enc.encode(candidate).length > 75) {
      out.push(buf);
      buf = ' ' + ch;
    } else {
      buf = candidate;
    }
  }
  if (buf) out.push(buf);
  return out.join('\r\n');
}

function line(key: string, value: string): string {
  return foldLine(`${key}:${value}`);
}

export function buildCalendar(options: {
  calName: string;
  events: IcsEvent[];
  prodId?: string;
}): string {
  const { calName, events, prodId = '-//2mains de femmes//agenda//FR' } = options;
  const stamp = formatUtcZ(new Date());
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    line('PRODID', prodId),
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    line('X-WR-CALNAME', escapeText(calName)),
    'X-WR-TIMEZONE:Europe/Paris',
  ];
  for (const ev of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(line('UID', ev.uid));
    lines.push(line('DTSTAMP', stamp));
    lines.push(line('DTSTART', formatFloating(ev.start)));
    if (ev.end) lines.push(line('DTEND', formatFloating(ev.end)));
    lines.push(line('SUMMARY', escapeText(ev.summary)));
    if (ev.description) lines.push(line('DESCRIPTION', escapeText(ev.description)));
    if (ev.location) lines.push(line('LOCATION', escapeText(ev.location)));
    if (ev.url) lines.push(line('URL', ev.url));
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
