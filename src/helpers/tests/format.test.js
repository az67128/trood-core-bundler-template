import * as format from '../format'


const testNumber = [
  '',
  'a',
  '1',
  '1000',
  '1234.56',
  '123456789',
  '123456,123456',
  '12345',
  '12.3.4',
  '12.3,4.5',
  '12,3,4,6,7',
  '12.',
  '12,',
]
const testNumberResult = [
  '',
  '',
  '1',
  '1 000',
  '1 234,56',
  '123 456 789',
  '123 456,123456',
  '12 345',
  '12,34',
  '12,345',
  '12,3467',
  '12',
  '12',
]
const testTrim = 2
const testNumberResultTrim = [
  '',
  '',
  '1',
  '1 000',
  '1 234,56',
  '123 456 789',
  '123 456,12',
  '12 345',
  '12,34',
  '12,34',
  '12,34',
  '12',
  '12',
]
const testNumberResultBack = [
  '',
  '',
  '1',
  '1000',
  '1234.56',
  '123456789',
  '123456.123456',
  '12345',
  '12.34',
  '12.345',
  '12.3467',
  '12',
  '12',
]
const testNumberResultBackTrim = [
  '',
  '',
  '1',
  '1000',
  '1234.56',
  '123456789',
  '123456.12',
  '12345',
  '12.34',
  '12.34',
  '12.34',
  '12',
  '12',
]

const testNumbersFrom = [
  '1.',
  '1,',
]

const testNumbersFromResult = [
  '1',
  '1',
]

const phoneLength = 10
const testPhoneSingle = '9161234567700'.split('')
const testPhone = ['', 'a', 'ab', 'abcd'].concat(testPhoneSingle.map((digit, index, phone) => {
  return phone.slice(0, index + 1).join('')
}))
const testPhoneResult = [
  '',
  '',
  '',
  '',
  '(9',
  '(91',
  '(916',
  '(916) 1',
  '(916) 12',
  '(916) 123',
  '(916) 123-4',
  '(916) 123-45',
  '(916) 123-45-6',
  '(916) 123-45-67',
  '(916) 123-45-67',
  '(916) 123-45-67',
  '(916) 123-45-67',
]

describe('format helper', () => {
  describe('format number', () => {
    testNumber.forEach((number, index) => {
      it(`can convert '${number}' to '${testNumberResult[index]}' and back to normal`, () => {
        const formated = format.toNumber(number)
        expect(formated).toEqual(testNumberResult[index])

        const formatedBack = format.fromNumber(formated)
        expect(formatedBack).toEqual(testNumberResultBack[index])
      })
      it(`can convert '${number}' to '${testNumberResultTrim[index]}' with trim ${testTrim} and back to normal`, () => {
        const formated = format.toNumber(number, testTrim)
        expect(formated).toEqual(testNumberResultTrim[index])

        const formatedBack = format.fromNumber(formated, testTrim)
        expect(formatedBack).toEqual(testNumberResultBackTrim[index])
      })
    })
    testNumbersFrom.forEach((number, index) => {
      it(`can convert back '${number}' to '${testNumbersFromResult[index]}'`, () => {
        const formated = format.fromNumber(number)
        expect(formated).toEqual(testNumbersFromResult[index])
      })
    })
  })

  describe('format phone', () => {
    testPhone.forEach((value, index) => {
      it(`can convert '${value}' to '${testPhoneResult[index]}' and back to normal`, () => {
        const formated = format.toPhone(value)
        expect(formated).toEqual(testPhoneResult[index])

        const formatedBack = format.fromPhone(formated)
        expect(formatedBack).toEqual(value.replace(/[^\d]/g, '').slice(0, phoneLength))
      })
    })

    it('can convert larger inputed phone number to normal', () => {
      const numberToCheck = '(916) 123-45-678'
      const formated = format.fromPhone(numberToCheck)
      expect(formated).toEqual('9161234567')
    })
  })
})
