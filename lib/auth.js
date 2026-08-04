// Demo users removed. Authentication should use the backend API.

export function getRoleHomePath(role) {
  switch (role) {
    case "admin":
      return "/admin/home";
    case "organizer":
      return "/organizer/home";
    case "gate_staff":
      return "/gatestaff/now";
    default:
      return "/organizer/login";
  }
}

export function parseSessionCookie(cookieValue) {
  if (!cookieValue) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(cookieValue);
    const session = JSON.parse(decoded);

    if (!session?.role || !session?.email) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}