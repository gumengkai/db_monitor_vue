import axios from '@/libs/api.request'

export const getLinuxStatList = parameter => {
  return axios.request({
    url: `/linux/api/linux-stat-list?${parameter}`,
    method: 'get'
  })
}

export const getLinuxStat = parameter => {
  return axios.request({
    url: `/linux/api/linux-stat?${parameter}`,
    method: 'get'
  })
}

export const getLinuxStatHis = parameter => {
  return axios.request({
    url: `/linux/api/linux-stat-his?${parameter}`,
    method: 'get'
  })
}

export const getLinuxDisk = parameter => {
  return axios.request({
    url: `/linux/api/linux-disk?${parameter}`,
    method: 'get'
  })
}

export const getLinuxDiskHis = parameter => {
  return axios.request({
    url: `/linux/api/linux-disk-his?${parameter}`,
    method: 'get'
  })
}

export const getLinuxIoStat = parameter => {
  return axios.request({
    url: `/linux/api/linux-io-stat?${parameter}`,
    method: 'get'
  })
}

export const getLinuxIoStatHis = parameter => {
  return axios.request({
    url: `/linux/api/linux-io-stat-his?${parameter}`,
    method: 'get'
  })
}
