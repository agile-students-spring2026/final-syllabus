export function bearerHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
