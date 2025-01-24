export const comparePasswords = async (
  password: string,
  hashedPassword: string
) => {
  return password === hashedPassword;
};

export const hashPassword = async (password: string) => {
  return password;
};
