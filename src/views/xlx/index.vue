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
      // https://share.fastgpt.in/chat/share?shareId=cfi76wyzdflhptfrdb45xjg1
      iframeSrc: 'https://share.fastgpt.in/chat/share?shareId=cfi76wyzdflhptfrdb45xjg1' // 心理学
    };
  },
  created() {
    this.init();
  },
  methods:{
    async init(){
      try{
        const res1 = await this.$store.dispatch('ai/accessKnowledge', {}, { fromCache: true });
        const res11 = await this.$store.dispatch('ai/accessKnowledge', {}, { fromCache: true });
        let params ={
          messages:[
            { role: 'user', content: '你是刘易行训练的AI模型，接下来请你以他的名义回答！' },
          ],
          chat_id:"test"
        }
        const res2 = await this.$store.dispatch('ai/chatWithKnowledge', params, { fromCache: true });
        const res3 = await this.$store.dispatch('ai/getKnowledgeList',{}, { fromCache: true });
        const res4 = await this.$store.dispatch('ai/getKnowledgeList',{}, { fromCache: true });
        const res5 = await this.$store.dispatch('ai/getKnowledgeDetail', {}, { fromCache: true });
        const res6 = await this.$store.dispatch('ai/getKnowledgeDetail', {}, { fromCache: true });
        const res7 = await this.$store.dispatch('ai/getKnowledgeDetail', {}, { fromCache: true });

        const res8 = await this.$store.dispatch('ai/getCollectionDetail', {}, { fromCache: true });
      }catch(error){
        console.log('Done')
      }
    },
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
