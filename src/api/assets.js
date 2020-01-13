import axios from '@/libs/api.request'

export const getOracleList = parameter => {
  return axios.request({
    url: `/assets/api/oracle?${parameter}`,
    method: 'get'
  })
}

export const createOracle = data => {
  return axios.request({
    url: '/assets/api/oracle',
    data: data,
    method: 'post'
  })
}

export const updateOracle = (id, data) => {
  return axios.request({
    url: `/assets/api/oracle/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteOracle = id => {
  return axios.request({
    url: `/assets/api/oracle/${id}`,
    method: 'delete'
  })
}

export const getMysqlList = parameter => {
  return axios.request({
    url: `/assets/api/mysql?${parameter}`,
    method: 'get'
  })
}

export const createMysql = data => {
  return axios.request({
    url: '/assets/api/mysql',
    data: data,
    method: 'post'
  })
}

export const updateMysql = (id, data) => {
  return axios.request({
    url: `/assets/api/mysql/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteMysql = id => {
  return axios.request({
    url: `/assets/api/mysql/${id}`,
    method: 'delete'
  })
}

export const getLinuxList = parameter => {
  return axios.request({
    url: `/assets/api/linux?${parameter}`,
    method: 'get'
  })
}

export const createLinux = data => {
  return axios.request({
    url: '/assets/api/linux',
    data: data,
    method: 'post'
  })
}

export const updateLinux = (id, data) => {
  return axios.request({
    url: `/assets/api/linux/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteLinux = id => {
  return axios.request({
    url: `/assets/api/linux/${id}`,
    method: 'delete'
  })
}

export const getRedisList = parameter => {
  return axios.request({
    url: `/assets/api/redis?${parameter}`,
    method: 'get'
  })
}

export const createRedis = data => {
  return axios.request({
    url: '/assets/api/redis',
    data: data,
    method: 'post'
  })
}

export const updateRedis = (id, data) => {
  return axios.request({
    url: `/assets/api/redis/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteRedis = id => {
  return axios.request({
    url: `/assets/api/redis/${id}`,
    method: 'delete'
  })
}
