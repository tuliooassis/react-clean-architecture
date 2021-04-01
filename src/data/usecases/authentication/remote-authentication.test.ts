import { RemoteAuthentication } from '.'
import { AuthenticationParams } from '@/domain/usecases'
import { UnexpectedError, InvalidCredentialsError } from '@/domain/errors'
import { mockAccountModel, mockAuthentication } from '@/domain/test-utils'
import { HttpPostClientSpy } from '@/data/test-utils'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  it('should call HttpPostClient with correct URL', async () => {
    const url = 'other_url'
    const { sut, httpPostClientSpy } = makeSut(url)

    await sut.auth(mockAuthentication())

    expect(httpPostClientSpy.url).toBe(url)
  })

  it('should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    await sut.auth(mockAuthentication())

    expect(httpPostClientSpy.body).toEqual({
      email: 'email@host.com',
      password: 'password'
    })
  })

  it('should return an AccountModel if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const accountModel = await sut.auth(mockAuthentication())

    expect(accountModel).toEqual(httpResult)
  })

  it('should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.auth(mockAuthentication())

    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  it.each([
    HttpStatusCode.badRequest,
    HttpStatusCode.notFound,
    HttpStatusCode.serverError
  ])('should throw UnexpectedError if HttpPostClient returns %s', async (httpStatusCode: HttpStatusCode) => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: httpStatusCode
    }
    const promise = sut.auth(mockAuthentication())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
