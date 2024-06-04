<template>
  <div class="fast-page">
    <iframe
        ref="iframe"
        :src="iframeSrc"
        frameborder="0"
        style="width: 100%; height: 100vh;"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeSrc: 'https://share.fastgpt.in/chat/share?shareId=8fopxqqio54vnuvmw249g8t5' // 计算机专业面试助手
    };
  },
};
</script>

<style scoped>
.fast-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
