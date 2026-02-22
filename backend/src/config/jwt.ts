function getJwtSecret(): string {
  const jwt = process.env.JWT_SECRET;
  if (!jwt) {
    throw new Error('JWT_SECRET non definito nel file .env');
  }
  return jwt;
}
export { getJwtSecret };