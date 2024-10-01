import type { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface registerUseCaseParams {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: registerUseCaseParams) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) throw new Error('E-mail already exists')

    // const prismaUsersRepository = new PrismaUsersRepository()
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
