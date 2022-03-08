import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { es } from "date-fns/locale";

export function differenceTime(firstDate: Date, lastDate: Date): string {
  const diffHours = differenceInHours(firstDate, lastDate);
  if (diffHours < 0) {
    if (diffHours === 1) {
      return `hace ${Math.abs(diffHours)} hora`;
    } else {
      return `hace ${Math.abs(diffHours)} horas`;
    }
  } else if (diffHours === 0) {
    const diffMinutes = differenceInMinutes(firstDate, lastDate);
    if (diffMinutes < 0) {
      if (diffMinutes === 1) {
        return `hace ${Math.abs(diffMinutes)} minuto`;
      } else {
        return `hace ${Math.abs(diffMinutes)} minutos`;
      }
    } else {
      if (diffMinutes === 1) {
        return `dentro de ${Math.abs(diffMinutes)} minutos`;
      } else {
        return `dentro de ${Math.abs(diffMinutes)} minutos`;
      }
    }
  } else {
    if (diffHours === 1) {
      return `dentro de ${Math.abs(diffHours)} hora`;
    } else {
      return `dentro de ${Math.abs(diffHours)} horas`;
    }
  }
}

export function getPeriod(start: Date, end: Date): string {
  return `${format(new Date(start), "d LLL. Y", {
    locale: es,
  })} - ${format(new Date(end), "d LLL. Y", {
    locale: es,
  })}`;
}

export function longDate(date: Date): string {
  if (date.getFullYear() !== new Date().getFullYear()) {
    return format(date, "d ' de ' LLLL ' del ' Y", {
      locale: es,
    });
  }
  return format(date, "d ' de ' LLLL", {
    locale: es,
  });
}

export function shortDate(date: Date): string {
  if (date.getFullYear() !== new Date().getFullYear()) {
    return format(date, "d LLL. Y", {
      locale: es,
    });
  }
  return format(date, "d LLL.", {
    locale: es,
  });
}

export function dateTime(date: Date): string {
  if (date.getFullYear() !== new Date().getFullYear()) {
    return format(date, "d LLLL Y 'a las' HH:mm", {
      locale: es,
    });
  }
  return format(date, "d LLLL 'a las' HH:mm", {
    locale: es,
  });
}

export function shortDateTime(date: Date): string {
  if (date.getFullYear() !== new Date().getFullYear()) {
    return format(date, "d LLL. Y HH:mm", {
      locale: es,
    });
  }
  return format(date, "d LLL. HH:mm", {
    locale: es,
  });
}
