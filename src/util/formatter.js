/* @flow */
export function zeroPad(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }
  return String(num);
}

export function formatDate(date: Date) {
  return `${date.getUTCFullYear()
    }-${zeroPad(date.getUTCMonth() + 1)
    }-${zeroPad(date.getUTCDate())
    }T${zeroPad(date.getUTCHours())
    }:${zeroPad(date.getUTCMinutes())
    }:${zeroPad(date.getUTCSeconds())
    }+00:00`;
}
