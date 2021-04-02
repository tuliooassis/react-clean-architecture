import { HttpPostParams } from './../../../data/protocols/http/http-post-client'
import { AxiosHttpClient } from '.'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
mockedAxios.post.mockResolvedValue({
  data: 'any_data',
  status: 200
})

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: 'any_url',
  body: {
    any_thing: 'any_thing'
  }
})

describe('AxiosHttpClient', () => {
  it('should call Axios with correct values', async () => {
    const sut = makeSut()
    const request = mockPostRequest()

    await sut.post(request)

    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  it('should return the correct statusCode and body', async () => {
    const sut = makeSut()

    const httpResponse = await sut.post(mockPostRequest())

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: 'any_data'
    })
  })
})
