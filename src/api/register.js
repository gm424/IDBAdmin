import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/api/member/register',
    method: 'post',
    data: data,
  })
}

export function getCode(data) {
  return request({
    url: '/api/verify/sendEmail',
    method: 'post',
    data: data,
  })
}
