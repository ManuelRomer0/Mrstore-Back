export class SignUpDto {
  username!: string;
  email!: string;
  password!: string;
  confirmPassword!: string;
}

export class LogInDto {
  identifier!: string;
  password!: string;
  rememberMe!: boolean;
}
