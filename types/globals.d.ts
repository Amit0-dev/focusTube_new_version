export {}

// Create a type for the Roles
export type Roles = 'admin' | 'learner' | 'creator';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}