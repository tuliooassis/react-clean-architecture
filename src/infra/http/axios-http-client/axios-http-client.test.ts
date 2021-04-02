import { AxiosHttpClient } from '.'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AxiosHttpClient', () => {
  it('should call Axios with correct url', async () => {
    const sut = new AxiosHttpClient()

    await sut.post({ url: 'any_url' })

    expect(mockedAxios).toHaveBeenCalledWith('any_url')
  })
})
