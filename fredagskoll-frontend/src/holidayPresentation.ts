import { Locale } from './locale';

export function getUpcomingHolidayBlurb(
  holidayName: string,
  daysUntil: number,
  locale: Locale = 'sv'
): string {
  if (locale === 'en') {
    if (daysUntil <= 1) {
      return `${holidayName} lands tomorrow, so the week is already structurally compromised.`;
    }

    if (daysUntil === 2) {
      return `${holidayName} is only two days away. Ambition levels should now be adjusted gently downward.`;
    }

    if (daysUntil === 3) {
      return `${holidayName} shows up in three days, which is close enough to ruin any serious long-range planning.`;
    }

    return `${holidayName} arrives later this week. Hold on. There is at least one official gap in the system coming.`;
  }

  if (locale === 'pt-BR') {
    if (daysUntil <= 1) {
      return `${holidayName} é amanhã, então a semana já está, estruturalmente, comprometida.`;
    }

    if (daysUntil === 2) {
      return `${holidayName} está a apenas dois dias. Níveis de ambição devem ser suavemente reduzidos.`;
    }

    if (daysUntil === 3) {
      return `${holidayName} aparece em três dias, tempo suficiente para sabotar qualquer planejamento sério a longo prazo.`;
    }

    return `${holidayName} chega no final da semana. Segure firme. Pelo menos uma brecha oficial no sistema está a caminho.`;
  }

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

export function formatDaysUntilLabel(daysUntil: number, locale: Locale = 'sv'): string {
  if (locale === 'en') {
    return `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} left`;
  }

  if (locale === 'pt-BR') {
    return `${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'} restantes`;
  }

  return `${daysUntil} ${daysUntil === 1 ? 'dag' : 'dagar'} kvar`;
}
