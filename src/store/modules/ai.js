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
        chatWithClose(context, params, config = {}) {
            const url = BACKEND_API_PREFIX+`/api/v1/llm_chat/chat_third/`;
            return http.post(url, params, config);
        },
        getSentiment(context, params, config = {}) {
            const url = BACKEND_API_PREFIX+`/api/v1/llm_chat/get_sentiment/`;
            return http.post(url, params, config);
        },
        accessKnowledge(context, params, config = {}) {
            const url = BACKEND_API_PREFIX +'/api/v1/knowledge/knowledge_base/'
            return http.get(url, params, config);
        },
        chatWithKnowledge(context, params, config = {}) {
            const url=BACKEND_API_PREFIX +'/api/v1/knowledge/chat_with_knowledge/'
            return http.post(url, params, config);
        },
        getKnowledgeList(context, params, config = {}) {
            const url=BACKEND_API_PREFIX+'/api/v1/knowledge/knowledge_list/'
            return http.get(url, params, config);
        },
        getKnowledgeDetail(context, params, config = {}) {
            const url = BACKEND_API_PREFIX +'/api/v1/knowledge/knowledge_detail/?knowledge_id=664702c71c6d4f88fb2bb175'
            return http.get(url, params, config);
        },
        getCollectionList(context, params, config = {}) {
            const url = BACKEND_API_PREFIX+'/api/v1/knowledge/collection_list/'
            return http.post(url, params, config);
        },
        getCollectionDetail(context, params, config = {}) {
            const url=BACKEND_API_PREFIX+'/api/v1/knowledge/collection_detail/?collection_id=66470e2f1c6d4f88fb2c2ca6'
            return http.get(url, params, config);
        },
        closeai(context, params, config = {}) {
            const url = BACKEND_API_PREFIX+'/api/v1/closeai/demo/'
            return http.get(url, params, config);
        },
    },
};
