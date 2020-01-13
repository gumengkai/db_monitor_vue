import axios from '@/libs/api.request'

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const getMockMenuData = () => {
  return axios.request({
    url: 'system/menu',
    method: 'post'
  })
}
