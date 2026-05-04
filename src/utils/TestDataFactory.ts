import * as crypto from 'crypto'

/** Generate unique test data to avoid collisions between test runs */
export const TestDataFactory = {
  uniqueEmail(): string {
    const ts = Date.now()
    return `test_${ts}@qa-automation.com`
  },

  uniqueUsername(): string {
    return `qa_user_${crypto.randomBytes(4).toString('hex')}`
  },

  randomPassword(length = 12): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$'
    return Array.from(crypto.randomFillSync(new Uint8Array(length)))
      .map((b) => chars[b % chars.length])
      .join('')
  },

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /** User payload for registration tests */
  newUser() {
    return {
      name: this.uniqueUsername(),
      email: this.uniqueEmail(),
      password: this.randomPassword(),
    }
  },
}
