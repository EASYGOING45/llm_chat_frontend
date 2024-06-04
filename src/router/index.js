/**
 * @file router 配置
 * @author
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';
import http from '@/api';
import preload from '@/common/preload';

const MainEntry = () => import(/* webpackChunkName: 'entry' */'@/views');
// import MainEntry from '@/views'
const Example1 = () => import(/* webpackChunkName: 'example1' */'@/views/example1');
// import Example1 from '@/views/example1'
const Example2 = () => import(/* webpackChunkName: 'example2' */'@/views/example2');
// import Example2 from '@/views/example2'
const Knowledge = () => import(/* webpackChunkName: 'example2' */'@/views/knowledge');
// import Knowledge from '@/views/knowledge'
const NLP = () => import(/* webpackChunkName: 'example2' */'@/views/nlp');
// import NLP from '@/views/nlp'
const Os = () => import(/* webpackChunkName: 'example2' */'@/views/os');
// import Os from '@/views/os'
const Net = () => import(/* webpackChunkName: 'example2' */'@/views/net');
// import Net from '@/views/ney'
const Zyk = () => import(/* webpackChunkName: 'example2' */'@/views/zyk');
// import Zyk from '@/views/zyk'
const Nk = () => import(/* webpackChunkName: 'example2' */'@/views/nk');
// import Nk from '@/views/nk'
const Wk = () => import(/* webpackChunkName: 'example2' */'@/views/wk');
// import Wk from '@/views/wk'
const Xlx = () => import(/* webpackChunkName: 'example2' */'@/views/xlx');
// import Xlx from '@/views/xlx'
const Ek = () => import(/* webpackChunkName: 'example2' */'@/views/ek');
// import Ek from '@/views/ek'
const Vision = () => import(/* webpackChunkName: 'example2' */'@/views/vision');
// import Vision from '@/views/vision'
const NotFound = () => import(/* webpackChunkName: 'none' */'@/views/404');
// import NotFound from '@/views/404'

Vue.use(VueRouter);

const routes = [
  {
    path: window.SITE_URL,
    name: 'appMain',
    component: MainEntry,
    alias: '',
    children: [
      {
        path: 'example1',
        alias: '',
        name: 'example1',
        component: Example1,
        meta: {
          matchRoute: '模型对话',
        },
      },
      {
        path: 'example2',
        name: 'example2',
        component: Example2,
        meta: {
          matchRoute: '计算机全栈面试助手',
        },
      },
      {
        path: 'nlp',
        name: 'nlp',
        component: NLP,
        meta: {
          matchRoute: 'NLP面试专家',
        },
      },
      {
        path: 'os',
        name: 'os',
        component: Os,
        meta: {
          matchRoute: '操作系统面试专家',
        },
      },
      {
        path: 'net',
        name: 'net',
        component: Net,
        meta: {
          matchRoute: '计算机网络面试专家',
        },
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: Knowledge,
        meta: {
          matchRoute: '医疗门诊专家',
        },
      },
      {
        path: 'wk',
        name: 'wk',
        component: Wk,
        meta: {
          matchRoute: '外科门诊专家',
        },
      },
      {
        path: 'nk',
        name: 'nk',
        component: Nk,
        meta: {
          matchRoute: '内科门诊专家',
        },
      },
      {
        path: 'xlx',
        name: 'xlx',
        component: Xlx,
        meta: {
          matchRoute: '彩虹心理咨询专家',
        },
      },
      {
        path: 'zyx',
        name: 'zyx',
        component: Zyk,
        meta: {
          matchRoute: '中医专家',
        },
      },
      {
        path: 'ek',
        name: 'ek',
        component: Ek,
        meta: {
          matchRoute: '儿科专家门诊',
        },
      },
      {
        path: 'vision',
        name: 'vision',
        component: Vision,
        meta: {
          matchRoute: '数据可视化',
        },
      },
    ],
  },
  // 404
  {
    path: '*',
    name: '404',
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

const cancelRequest = async () => {
  const allRequest = http.queue.get();
  const requestQueue = allRequest.filter(request => request.cancelWhenRouteChange);
  await http.cancel(requestQueue.map(request => request.requestId));
};

let preloading = true;
let canceling = true;
let pageMethodExecuting = true;

router.beforeEach(async (to, from, next) => {
  canceling = true;
  await cancelRequest();
  canceling = false;
  next();
});

router.afterEach(async (to) => {
  store.commit('setMainContentLoading', true);

  preloading = true;
  await preload();
  preloading = false;

  const pageDataMethods = [];
  const routerList = to.matched;
  routerList.forEach((r) => {
    Object.values(r.instances).forEach((vm) => {
      if (typeof vm.fetchPageData === 'function') {
        pageDataMethods.push(vm.fetchPageData());
      }
      if (typeof vm.$options.preload === 'function') {
        pageDataMethods.push(vm.$options.preload.call(vm));
      }
    });
  });

  pageMethodExecuting = true;
  await Promise.all(pageDataMethods);
  pageMethodExecuting = false;

  if (!preloading && !canceling && !pageMethodExecuting) {
    store.commit('setMainContentLoading', false);
  }
});

export default router;
