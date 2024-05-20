<template>
  <div class="fast-page">
    <iframe
        :src="iframeSrc"
        frameborder="0"
        style="width: 100%; height: 100vh;"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'FastPage',
  data() {
    return {
      iframeSrc: 'https://cloud.fastgpt.in/'
    };
  }
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
