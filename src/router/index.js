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
          matchRoute: '知识库',
        },
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: Knowledge,
        meta: {
          matchRoute: '知识库对话',
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
