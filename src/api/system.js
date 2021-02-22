import axios from '@/libs/api.request'

export const getAlertLog = parameter => {
  return axios.request({
    url: `/system/api/alert-log?${parameter}`,
    method: 'get'
  })
}

export const getAlarmConf = parameter => {
  return axios.request({
    url: `/system/api/alarm-conf?${parameter}`,
    method: 'get'
  })
}

export const updateAlarmConf = (id, data) => {
  return axios.request({
    url: `/system/api/alarm-conf/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteAlarmCconf = id => {
  return axios.request({
    url: `/system/api/alarm-conf/${id}`,
    method: 'delete'
  })
}

export const getAlarmInfo = parameter => {
  return axios.request({
    url: `/system/api/alarm-info?${parameter}`,
    method: 'get'
  })
}

export const setupOracleRac = data => {
  return axios.request({
    url: '/system/api/oracle-rac-setup',
    data: data,
    method: 'post'
  })
}

export const setupOracleRacOneNode = data => {
  return axios.request({
    url: '/system/api/oracle-rac-onenode-setup',
    data: data,
    method: 'post'
  })
}

export const setupOracleOneNode = data => {
  return axios.request({
    url: '/system/api/oracle-onenode-setup',
    data: data,
    method: 'post'
  })
}

export const getSetupLog = parameter => {
  return axios.request({
    url: `/system/api/setup-log?${parameter}`,
    method: 'get'
  })
}
