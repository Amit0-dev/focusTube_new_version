enum Role {
  Learner = 'learner',
  Creator = 'creator',
  Admin = 'admin',
}

export const isValidRole = (role: unknown): role is Role => {
  return Object.values(Role).includes(role as Role);
};
