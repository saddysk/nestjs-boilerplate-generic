import { isURL } from 'class-validator';

describe('IsUrl', () => {
  it('should validate url', () => {
    expect(isURL('https://google.com')).toBe(true);
    expect(isURL('http://google.com')).toBe(true);
    expect(isURL('https://google.com', { protocols: ['https'] })).toBe(true);
    expect(isURL('http://google.com', { protocols: ['http'] })).toBe(true);

    //
    expect(isURL('https://localhost:8080', { require_tld: false })).toBe(true);
    expect(isURL('http://localhost:8080', { require_tld: false })).toBe(true);
    expect(isURL('https://localhost:8080', { protocols: ['https'], require_tld: false })).toBe(true);
    expect(isURL('http://localhost:8080', { protocols: ['http'], require_tld: false })).toBe(true);
    // expect(IsUrl('https://google.com', { protocols: ['http'] })).toBe(false);
    // expect(IsUrl('http://google.com', { protocols: ['https'] })).toBe(false);
    // expect(IsUrl('https://google.com', { protocols: ['https', 'http'] })).toBe(true);
    // expect(IsUrl('http://google.com', { protocols: ['https', 'http'] })).toBe(true);
    // expect(IsUrl('https://google.com', { protocols: ['https', 'http'], requireTld: false })).toBe(true);
    // expect(IsUrl('http://google.com', { protocols: ['https', 'http'], requireTld: false })).toBe(true);
    // expect(IsUrl('https://google.com', { protocols: ['https', 'http'], requireTld: true })).toBe(true);
    // expect(IsUrl('http://google.com', { protocols: ['https', 'http'], requireTld: true })).toBe(true);
    // expect(IsUrl('https://google.com', { protocols: ['https', 'http'], requireTld: true, requireProtocol: true })).toBe(true);
    // expect(IsUrl('http://google.com', { protocols: ['https', 'http'], requireTld: true, requireProtocol: true })).toBe(true);
    // expect(IsUrl('https://google.com', { protocols: ['https', 'http'], requireTld: true, requireProtocol: false })).toBe(true);
    // expect(IsUrl('http://google.com', { protocols: ['https', 'http'], requireTld: true, requireProtocol: false })).toBe(true);
    // expect(IsUrl('https://google.com', { protocols: ['https', 'http'], requireTld: false, requireProtocol: true })).toBe(true);
    // expect(IsUrl('http://google.com', { protocols: ['https', 'http'], requireTld: false, requireProtocol: true })).toBe(true);
    // expect(IsUrl('https://google.com', { protocols: ['https', 'http'], requireTld: false, requireProtocol: false })).toBe(true);
    // expect(IsUrl('http://google.com', { protocols: ['https', 'http'], requireTld: false, requireProtocol: false })).toBe(true);
  });
});
