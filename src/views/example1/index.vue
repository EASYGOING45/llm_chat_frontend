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
      <div class="chat-box">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
          <div class="bubble">
            <p>{{ message.content }}</p>
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
      <el-button type="primary" @click="sendMessage">发送</el-button>
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
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'gpt-4', name: 'GPT-4' },
        // Add more models as needed
      ],
      contextLength: 0,
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
      userMessage: '',
      loading: false,
    };
  },
  methods: {
    handleModelChange(value) {
      console.log('Selected model:', value);
      // Fetch context length or other model-specific information if needed
    },
    async sendMessage() {
      if (!this.userMessage.trim()) return;

      const userMessage = {
        role: 'user',
        content: this.userMessage,
      };
      this.messages.push(userMessage);
      this.userMessage = '';
      this.loading = true;

      try {
        const response = await axios.post('https://api.closeai-proxy.xyz/v1/chat/completions', {
          model: this.selectedModel,
          messages: this.messages,
        }, {
          headers: {
            'Authorization': 'Bearer sk-7t26vn8iQOlVRFVSFYtc1RFEJ2PrmiWvA4Vr0yG21IUeknbT',
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'api.closeai-proxy.xyz',
            'Connection': 'keep-alive',
          },
        });

        const botMessage = {
          role: 'assistant',
          content: response.data.choices[0].message.content.trim(),
        };
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
  height: 800px;
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
  height: 80vh; /* 固定高度 */
  overflow-y: auto;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
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
