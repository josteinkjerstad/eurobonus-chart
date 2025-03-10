export function checkAuth(cookies: any): boolean {
  // Implement your authentication logic here
  // For example, check if a valid token exists in cookies
  const token = cookies.get("authToken");
  return token !== undefined;
}
