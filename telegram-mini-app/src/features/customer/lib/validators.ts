export const validatePhone = (phone: string): string => {
  if (!phone) return "";
  const phoneRegex = /^(09|07)\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return "Must be 10 digits starting with 09 or 07";
  }
  return "";
};

export const validateEmail = (email: string): string => {
  if (!email) return "";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@astu\.edu\.et$/;
  if (!emailRegex.test(email)) {
    return "Use your ASTU email (example: first.last@astu.edu.et)";
  }
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "";
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!minLength || !hasUpper || !hasLower || !hasNumber) {
    return "Min 8 chars, include uppercase, lowercase, and number";
  }
  return "";
};
