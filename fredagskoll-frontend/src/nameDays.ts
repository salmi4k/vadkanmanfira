interface SholidayResponse {
  dagar?: Array<{
    namnsdag?: string[];
  }>;
}

export async function fetchNameDays(dateLabel: string): Promise<string[]> {
  const [year, month, day] = dateLabel.split('-');
  const response = await fetch(
    `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}/${day}`
  );

  if (!response.ok) {
    throw new Error(`Namnsdag lookup failed for ${dateLabel}`);
  }

  const payload = (await response.json()) as SholidayResponse;

  if (!Array.isArray(payload.dagar) || !Array.isArray(payload.dagar[0]?.namnsdag)) {
    return [];
  }

  return payload.dagar[0].namnsdag;
}
