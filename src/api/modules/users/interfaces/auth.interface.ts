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