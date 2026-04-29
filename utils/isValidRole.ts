enum Role {
  LEARNER = 'LEARNER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
}

export const isValidRole = (role: unknown): role is Role => {
  return Object.values(Role).includes(role as Role);
};
