import axios from '@/libs/api.request'

export const getMysqlStatList = parameter => {
  return axios.request({
    url: `/mysql/api/mysql-stat-list?${parameter}`,
    method: 'get'
  })
}

export const getMysqlStat = parameter => {
  return axios.request({
    url: `/mysql/api/mysql-stat?${parameter}`,
    method: 'get'
  })
}

export const getMysqlStatHis = parameter => {
  return axios.request({
    url: `/mysql/api/mysql-stat-his?${parameter}`,
    method: 'get'
  })
}

export const getMysqlSlowquery = parameter => {
  return axios.request({
    url: `/mysql/api/mysql-slowquery?${parameter}`,
    method: 'get'
  })
}

