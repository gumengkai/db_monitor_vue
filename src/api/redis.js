import axios from '@/libs/api.request'

export const getRedisStatList = parameter => {
  return axios.request({
    url: `/rds/api/redis-stat-list?${parameter}`,
    method: 'get'
  })
}

export const getRedisStat = parameter => {
  return axios.request({
    url: `/rds/api/redis-stat?${parameter}`,
    method: 'get'
  })
}

export const getRedisStatHis = parameter => {
  return axios.request({
    url: `/rds/api/redis-stat-his?${parameter}`,
    method: 'get'
  })
}

export const getRedisConfig = parameter => {
  return axios.request({
    url: `/rds/api/get-redis-config?${parameter}`,
    method: 'get'
  })
}

export const getRedisSlowLog = parameter => {
  return axios.request({
    url: `/rds/api/get-redis-slowlog?${parameter}`,
    method: 'get'
  })
}

export const getRedisClientList = parameter => {
  return axios.request({
    url: `/rds/api/get-redis-clientlist?${parameter}`,
    method: 'get'
  })
}

export const getRedisImmediateStats = parameter => {
  return axios.request({
    url: `/rds/api/get-redis-immediate-stats?${parameter}`,
    method: 'get'
  })
}
