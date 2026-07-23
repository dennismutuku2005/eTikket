export const demoUsers = [
  {
    email: "admin@etikket.co.ke",
    phone: "0711000001",
    password: "admin123",
    role: "admin",
    name: "Admin",
  },
  {
    email: "organizer@etikket.co.ke",
    phone: "0711000002",
    password: "organizer123",
    role: "organizer",
    name: "Organizer",
  },
  {
    email: "user@etikket.co.ke",
    phone: "0711000003",
    password: "user123",
    role: "user",
    name: "User",
  },
];

export function getDemoUser(identifier, password) {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  return demoUsers.find((user) => {
    const matchesEmail = user.email.toLowerCase() === normalizedIdentifier;
    const matchesPhone = user.phone === normalizedIdentifier;

    return user.password === password && (matchesEmail || matchesPhone);
  });
}

export function getRoleHomePath(role) {
  switch (role) {
    case "admin":
      return "/admin/home";
    case "organizer":
      return "/organizer/home";
    case "user":
      return "/user/home";
    default:
      return "/login";
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