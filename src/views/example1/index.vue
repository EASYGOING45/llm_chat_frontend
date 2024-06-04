<template>
  <div class="chat-container">
    <el-header>
      <el-select v-model="selectedModel" placeholder="选择模型" @change="handleModelChange">
        <el-option
            v-for="model in models"
            :key="model.id"
            :label="model.name"
            :value="model.id">
        </el-option>
      </el-select>
      <span class="context-length">上下文长度: {{ contextLength }}</span>
    </el-header>

    <el-main>
      <div class="chat-box" >
        <div v-for="(message, index) in messages" :key="index" v-if="message.role !== 'system'" :class="['message', message.role]">
          <div class="bubble">
            <p>{{ message.content }}</p>
          </div>
          <div v-if="message.sentiment" class="sentiment">
            情感分析: {{ message.sentiment }}
          </div>
        </div>
        <div v-if="loading" class="loading">
          <div class="dot-flashing"></div>
        </div>
      </div>
    </el-main>

    <el-footer>
      <el-input
          type="textarea"
          v-model="userMessage"
          placeholder="输入你的消息..."
          @keyup.enter.native="sendMessage"
          rows="2">
      </el-input>
      <el-button type="primary" @click="sendMessage_v2">发送</el-button>
    </el-footer>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedModel: 'gpt-3.5-turbo', // 默认选择一个模型
      models: [
        { id: 'gpt-3.5-turbo', name: '微调面试助手-ctenetliu' },
        { id: 'gpt-4', name: 'GPT-4' },
        // Add more models as needed
      ],
      contextLength: 0,
      messages: [
          { role: 'system', content: '你是刘易行训练的AI模型，接下来请你以他的名义回答！' },
          { role: 'assistant', content: '我是刘易行训练的计算机领域面试助手，欢迎！',sentiment:'positive' }
      ],
      userMessage: '',
      loading: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init(){
      try{
        // const res1 = await this.$store.dispatch('example/userLogin', {}, { fromCache: true });
      }catch(err){
        console.log(err);
      }

    },
    handleModelChange(value) {
      console.log('Selected model:', value);
      // Fetch context length or other model-specific information if needed
    },
    async sendMessage_v2(){
      if (!this.userMessage.trim()) return;

      const userMessage = {
        role: 'user',
        content: this.userMessage,
      };
      try{
        let text_params = {message:userMessage.content}
        // 情感分析附加
        const sentiment = await this.$store.dispatch('ai/getSentiment',text_params,{fromCache:true})
        userMessage.sentiment = sentiment.data;
      }catch(err){
        userMessage.sentiment='positive'
        console.log('sentiment occur',err);
      }

      console.log('In')

      this.messages.push(userMessage);
      this.userMessage = '';
      this.loading = true;

      try {
        let params = {messages:this.messages}
        const response = await this.$store.dispatch('ai/chatWithClose',params,{fromCache:true})

        const botMessage = {
          role: 'assistant',
          content: response.data.choices[0].message.content.trim(),
        };

        // 情感分析附加
        let bot_message = {message:botMessage.content};
        console.log('bot',bot_message)
        try{
          let bot_sentiment = await this.$store.dispatch('ai/getSentiment',bot_message,{fromCache:true})
          botMessage.sentiment = bot_sentiment.data;
        }catch(error){
          console.log('响应为空')
          botMessage.sentiment = 'netural';
        }

        this.messages.push(botMessage);
        this.contextLength = this.messages.map(m => m.content).join(' ').length;
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.el-header, .el-footer {
  background-color: #f5f5f5;
  padding: 10px;
}

.el-main {
  flex: 1;
  overflow-y: hidden;
  padding: 10px;
}

.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%; /* 固定高度 */
  overflow-y: auto;
}

.message {
  display: flex;
  flex-direction: column; /* 使消息和情感分析垂直排列 */
  margin-bottom: 10px;
}

.message.user {
  align-items: flex-end; /* 用户消息右对齐 */
}

.message.assistant {
  align-items: flex-start; /* 助手消息左对齐 */
}

.bubble {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: #e0e0e0;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap; /* 保持换行 */
  overflow-wrap: break-word; /* 确保长单词也能换行 */
}

.message.user .bubble {
  background-color: #409eff;
  color: white;
}

.sentiment {
  margin-top: 5px;
  font-size: 0.9em;
  color: #555;
  align-self: flex-start; /* 情感分析左对齐 */
}

.message.user .sentiment {
  align-self: flex-end; /* 用户消息的情感分析右对齐 */
}

.context-length {
  float: right;
  line-height: 32px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.dot-flashing {
  position: relative;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #409eff;
  color: #409eff;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: .5s;
}

.dot-flashing::before, .dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -1.5em;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #409eff;
  color: #409eff;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 1.5em;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #409eff;
  color: #409eff;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dotFlashing {
  0% {
    background-color: #409eff;
  }
  50%, 100% {
    background-color: #fff;
  }
}
</style>


