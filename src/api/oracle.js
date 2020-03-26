import axios from '@/libs/api.request'

export const getOracleStatList = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-stat-list?${parameter}`,
    method: 'get'
  })
}

export const getOracleStat = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-stat?${parameter}`,
    method: 'get'
  })
}

export const getOracleStatHis = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-stat-his?${parameter}`,
    method: 'get'
  })
}

export const getOracleTableSpace = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-tablespace?${parameter}`,
    method: 'get'
  })
}

export const getOracleTableSpaceHis = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-tablespace-his?${parameter}`,
    method: 'get'
  })
}

export const getOracleTableSpaceLargetObject = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-tablespace-largeobject?${parameter}`,
    method: 'get'
  })
}

export const getOracleTableSpaceDayUsed = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-tablespace-dayused?${parameter}`,
    method: 'get'
  })
}

export const getOracleTempTableSpace = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-temp-tablespace?${parameter}`,
    method: 'get'
  })
}

export const getOracleTempTableSpaceHis = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-temptablespace-his?${parameter}`,
    method: 'get'
  })
}

export const getOracleTempTableSpaceSessionUsed = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-temptablespace-sessionused?${parameter}`,
    method: 'get'
  })
}

export const getOracleUndoTableSpace = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-undo-tablespace?${parameter}`,
    method: 'get'
  })
}

export const getOracleUndoTableSpaceHis = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-undotablespace-his?${parameter}`,
    method: 'get'
  })
}

export const getOracleUndoTableSpaceUsed = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-undotablespace-used?${parameter}`,
    method: 'get'
  })
}

export const getOracleUndoTableSpaceSessionUsed = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-undotablespace-sessionused?${parameter}`,
    method: 'get'
  })
}

export const getOracleTopSegment = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-top-segment?${parameter}`,
    method: 'get'
  })
}

export const getOracleSequenceUsed = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-sequence-used?${parameter}`,
    method: 'get'
  })
}

export const getOracleUser = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-user?${parameter}`,
    method: 'get'
  })
}

export const getOracleProfile = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-profile?${parameter}`,
    method: 'get'
  })
}

export const getOracleUserRole = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-user-role?${parameter}`,
    method: 'get'
  })
}

export const getOracleUserGrant = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-user-grant?${parameter}`,
    method: 'get'
  })
}

export const getOracleActiveSession = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-active-session?${parameter}`,
    method: 'get'
  })
}

export const getOracleBlockingSession = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-blocking-session?${parameter}`,
    method: 'get'
  })
}

export const getOracleSessionCount = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-session-count?${parameter}`,
    method: 'get'
  })
}

export const getOracleBlockCount = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-block-count?${parameter}`,
    method: 'get'
  })
}

export const getOracleTableStats = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-table-stats?${parameter}`,
    method: 'get'
  })
}

export const getOracleControlFile = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-controlfile?${parameter}`,
    method: 'get'
  })
}

export const getOracleRedoLog = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-redolog?${parameter}`,
    method: 'get'
  })
}

export const getOracleRedoLogSwitch = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-redolog-switch?${parameter}`,
    method: 'get'
  })
}

export const getOracleTopSql = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-top-sql?${parameter}`,
    method: 'get'
  })
}

export const getOracleSnapList = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-snap-list?${parameter}`,
    method: 'get'
  })
}

export const getOracleReportList = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-report-list?${parameter}`,
    method: 'get'
  })
}

export const getOracleReport = parameter => {
  return axios.request({
    url: `/oracle/api/oracle-get-report?${parameter}`,
    method: 'get'
  })
}

export const createOracleReport = data => {
  return axios.request({
    url: '/oracle/api/oracle-create-report',
    data: data,
    method: 'post'
  })
}

export const deleteOracleReport = id => {
  return axios.request({
    url: `/oracle/api/oracle-report/${id}`,
    method: 'delete'
  })
}
