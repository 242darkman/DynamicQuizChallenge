import jwt from 'jsonwebtoken';

function evaluateSessionStatus() {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem("app_token");

  if (!token) {
    return false
  };

  const decoded = jwt.decode(token);
  const isTokenExpired = decoded.exp * 1000 < Date.now();

  if (isTokenExpired) {
    localStorage.removeItem("app_token");
    return false
  };

  return true;
}

export const sessionStatus = evaluateSessionStatus();