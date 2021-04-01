import { AccountModel } from '@/domain/models/account-model'
import { AuthenticationParams } from '@/domain/usecases/authentication'

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'email@host.com',
  password: 'password'
})

export const mockAccountModel = (): AccountModel => ({
  accessToken: 'accessToken'
})
