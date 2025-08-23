export interface LoginResponse {
  token: string;
  user: {
    Id: number;
    VcEmail: string;
    VcFirstName: string;
    VcFirstLastName: string;
    VcNickName?: string;
  };
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface TokenValidationResponse {
  isValid: boolean;
  expiresAt: Date;
  expiresIn: number;
  expiresInMinutes: number; 
  shouldRenew: boolean; 
  user: {
    userId: number;
    email: string;
  };
}