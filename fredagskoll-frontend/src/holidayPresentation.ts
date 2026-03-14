export function getUpcomingHolidayBlurb(holidayName: string, daysUntil: number): string {
  if (daysUntil <= 1) {
    return `${holidayName} väntar imorgon, så veckan är i praktiken redan perforerad.`;
  }

  if (daysUntil === 2) {
    return `${holidayName} ligger bara två dagar bort. Ambitionsnivån bör därefter justeras försiktigt nedåt.`;
  }

  if (daysUntil === 3) {
    return `${holidayName} dyker upp om tre dagar, vilket är nära nog för att sabotera seriös framförhållning.`;
  }

  return `${holidayName} ligger senare i veckan. Håll ut, det finns åtminstone en officiell lucka i systemet.`;
}

export function formatDaysUntilLabel(daysUntil: number): string {
  return `${daysUntil} ${daysUntil === 1 ? 'dag' : 'dagar'} kvar`;
}
