import { HttpPostParams } from '@/data/protocols/http'

export const mockPostRequest = (): HttpPostParams<any> => ({
  url: 'any_url',
  body: {
    any_thing: 'any_thing'
  }
})
