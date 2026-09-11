export interface UserLogin {
  user_email: string;
  password?: string;
}

export interface UserCreate {
  user_email: string;
  password?: string;
  full_name?: string | null;
}

export interface JwtPayload {
  sub: string;
  exp: number;
  user_email: string;
  full_name: string | null;
  roles: string[];
  permissions: string[];
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: JwtPayload;
}

export interface UserWithRolesResponse {
  user_id: string;
  user_email: string;
  full_name: string | null;
  is_active: boolean;
  roles: any[]; // RoleResponse[]
}
