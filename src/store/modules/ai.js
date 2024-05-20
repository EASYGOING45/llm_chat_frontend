/**
 * @file app store
 * @author
 */

import http from '@/api';
import queryString from 'query-string';

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
        chatWithClose(context, params, config = {}) {
            const url = `http://dev.ce.bktencent.com:8000/api/v1/llm_chat/chat_third/`;
            return http.post(url, params, config);

            // const url = `http://dev.ce.bktencent.com:8000/api/v1/llm_chat/chat_third/?${queryString.stringify(params)}`;
            // return http.get(url, { ...config });
        },
        getSentiment(context, params, config = {}) {
            const url = `http://dev.ce.bktencent.com:8000/api/v1/llm_chat/get_sentiment/`;
            return http.post(url, params, config);

            // const url = `http://dev.ce.bktencent.com:8000/api/v1/llm_chat/chat_third/?${queryString.stringify(params)}`;
            // return http.get(url, { ...config });
        },
    },
};
