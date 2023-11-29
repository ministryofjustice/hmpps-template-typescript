export default interface TokenStore {
  setToken(key: string, token: string, durationSeconds: number): Promise<void>
  getToken(key: string): Promise<string>
}
