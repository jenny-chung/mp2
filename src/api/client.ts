import axios from 'axios'

export const client = axios.create({
  baseURL: 'https://api.artic.edu/api/v1'
})
