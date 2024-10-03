import type { UsersRepository } from '@/repositories/users-repository'
import bcryptjs from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import type { User } from '@prisma/client'

interface registerUseCaseParams {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: registerUseCaseParams): Promise<RegisterUseCaseResponse> {
    const password_hash = await bcryptjs.hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    // const prismaUsersRepository = new PrismaUsersRepository()
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
