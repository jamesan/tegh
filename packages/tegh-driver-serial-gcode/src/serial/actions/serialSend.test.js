// @flow
import serialSend, { SERIAL_SEND } from './serialSend'

const line = 'G12345 (╯°□°）╯︵ ┻━┻'

describe('with a line number', () => {
  test('adds the checksum and line number', () => {
    const lineNumber = 1995
    // See http://reprap.org/wiki/G-code#.2A:_Checksum
    const expectedOutputLine = `N1995 ${line}*168\n`

    const result = serialSend(line, { lineNumber })

    expect(result).toEqual({
      type: SERIAL_SEND,
      payload: {
        code: 'G12345',
        lineNumber,
        line: expectedOutputLine,
      },
    })
  })
})

describe('with lineNumber: false', () => {
  test('sends the line without a checksum or line number', () => {
    const expectedOutputLine = `${line}\n`

    const result = serialSend(line, { lineNumber: false })

    expect(result).toEqual({
      type: SERIAL_SEND,
      payload: {
        code: 'G12345',
        lineNumber: false,
        line: expectedOutputLine,
      },
    })
  })
})

describe('with lineNumber: undefined', () => {
  test('throws an error', () => {
    expect(() => {
      serialSend(line, { lineNumber: undefined })
    }).toThrow()
  })
})
