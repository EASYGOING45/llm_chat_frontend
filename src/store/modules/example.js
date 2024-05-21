/**
 * @file app store
 * @author
 */

import http from '@/api';
import queryString from 'query-string';

// 根据实际环境，灵活控制后端的API前缀，更符合蓝鲸最佳实践规范
const BACKEND_API_PREFIX = process.env.BK_BACKEND_API_PREFIX

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    getTableData(context, params, config = {}) {
      // eslint-disable-next-line no-undef
      return http.get(`/api/table?&${queryString.stringify(params)}`, params, config);
    },
    getUserInfo(context, params, config = {}) {
      const url = BACKEND_API_PREFIX +'/api/v1/user_manage/users_list/'
      return http.get(url, params, config);
    },
    userLogin(context, params, config = {}) {
      const url = BACKEND_API_PREFIX +'/api/v1/user_manage/login/'
      return http.get(url, params, config);
    }
  },
};
