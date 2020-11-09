export const longName = usr => {
  if (!usr) return '-'
  return [
    usr.firstName,
    usr.lastName,
    usr.secondName,
  ].join(' ')
}

export const shortName = usr => {
  if (!usr) return '-'
  return [
    `${usr.lastName} `,
    usr.firstShort ? `${usr.firstShort.slice(0, 1)}.` : '',
    usr.secondName ? `${usr.secondName.slice(0, 1)}.` : '',
  ].join('')
}

export const fullName = c => {
  if (c && c.firstName && c.lastName) return `${c.firstName} ${c.lastName}`
  return '-'
}
