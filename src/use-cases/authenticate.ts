import type { UsersRepository } from '@/repositories/users-repository'
import type { User } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import bcryptjs from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatches = await bcryptjs.compare(
      password,
      user.password_hash,
    )

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return { user }
  }
}
