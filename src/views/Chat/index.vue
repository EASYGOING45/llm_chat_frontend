<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>ChatGPT</h1>
    </div>
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in messages" :key="index" :class="{'user-message': message.type === 'user', 'bot-message': message.type === 'bot'}">
        <p>{{ message.text }}</p>
      </div>
    </div>
    <div class="chat-input">
      <bk-input v-model="userInput" placeholder="请输入消息..." clearable @enter="sendMessage"/>
      <bk-button type="primary" @click="sendMessage">发送</bk-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInput: '',
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      // Add user message to the messages array
      this.messages.push({type: 'user', text: this.userInput});

      const userMessage = this.userInput;
      this.userInput = ''; // Clear input field

      try {
        const response = await axios.post('/api/chat', {message: userMessage});
        const botMessage = response.data.reply;

        // Add bot message to the messages array
        this.messages.push({type: 'bot', text: botMessage});

        // Scroll to the bottom of the messages container
        this.$nextTick(() => {
          const container = this.$refs.messageContainer;
          container.scrollTop = container.scrollHeight;
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  background-color: #3a3f51;
  color: white;
  padding: 10px;
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.user-message {
  text-align: right;
}

.bot-message {
  text-align: left;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chat-input .bk-input {
  flex: 1;
  margin-right: 10px;
}
</style>
