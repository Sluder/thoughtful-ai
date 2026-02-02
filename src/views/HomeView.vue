<script setup lang="ts">
import { computed, ref } from 'vue';
import { OpenAI } from 'openai';

type Message = {
  sender: 'user' | 'agent',
  text: string,
}
type QuestionResponse = {
  question: string,
  answer: string,
}

const OPEN_AI_API_KEY: string = import.meta.env.VITE_APP_OPEN_AI_API_KEY ?? '';
const KNOWLEDGE: QuestionResponse[] = [
  {
    question: 'What does the eligibility verification agent (EVA) do?',
    answer: 'EVA automates the process of verifying a patient’s eligibility and benefits information in real-time, eliminating manual data entry errors and reducing claim rejections.',
  },
  {
    question: 'What does the claims processing agent (CAM) do?',
    answer: 'CAM streamlines the submission and management of claims, improving accuracy, reducing manual intervention, and accelerating reimbursements.',
  },
  {
    question: 'How does the payment posting agent (PHIL) work?',
    answer: 'PHIL automates the posting of payments to patient accounts, ensuring fast, accurate reconciliation of payments and reducing administrative burden.',
  },
  {
    question: 'Tell me about Thoughtful AI\'s Agents.',
    answer: 'Thoughtful AI provides a suite of AI-powered automation agents designed to streamline healthcare processes. These include Eligibility Verification (EVA), Claims Processing (CAM), and Payment Posting (PHIL), among others.',
  },
  {
    question: 'What are the benefits of using Thoughtful AI\'s agents?',
    answer: 'Using Thoughtful AI\'s Agents can significantly reduce administrative costs, improve operational efficiency, and reduce errors in critical processes like claims management and payment posting.',
  },
];

const client = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const text = ref<string>('')
const isWaiting = ref<boolean>(false)
const messages = ref<Message[]>([
  {
    sender: "agent",
    text: "Hello there! Ask me anything about Thoughtful AI.",
  },
]);

const canSendMessage = computed(() => !isWaiting.value && text.value)

if (! OPEN_AI_API_KEY) {
  messages.value.push({
    sender: 'agent',
    text: "Looks like I'm missing my VITE_APP_OPEN_AI_API_KEY in the .env file",
  });
}

/**
 * Send the user message to OpenAI.
 */
async function sendMessage() {
  const userText = text.value.trim();

  messages.value.push({
    sender: 'user',
    text: text.value,
  });

  isWaiting.value = true;
  text.value = '';

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
              "You are a customer support assistant for Thoughtful AI. " +
              "If the user asks about Thoughtful AI specifics that you do not know from provided FAQ context, do NOT invent details. " +
              "Refer to your knowledge to answer the user's questions. Do not make up details." +
              "# Your knowledge - Use the prefilled responses \n",
              ...KNOWLEDGE.map((item: QuestionResponse) => {
                return `Question: ${item.question} \n` +
                  `Answer: ${item.answer} \n`
              })
        },
        { role: "user", content: userText },
      ],
      temperature: 1,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    messages.value.push({
      sender: 'agent',
      text: reply,
    });
  } catch (e) {
    messages.value.push({
      sender: 'agent',
      text: 'There was an issue answering that question, try again?',
    });
  } finally {
    isWaiting.value = false;
  }
}
</script>

<template>
  <div class="grid grid-cols-3 p-15">
    <div class="col-start-2 col-span-1">

      <!-- Messages -->
      <div class="overflow-y-auto h-[500px] flex flex-col gap-2">
        <div v-for="(message, i) in messages" :key="i">

          <div v-if="message.sender === 'agent'" class="flex text-white text-sm">
            {{ message.text }}
          </div>

          <div v-else-if="message.sender === 'user'" class="flex justify-self-end  bg-slate-800 rounded w-1/2 px-3 py-2">
            <span class="text-white text-sm">{{ message.text }}</span>
          </div>

        </div>

        <div v-if="isWaiting">
          <i>Thinking ...</i>
        </div>
      </div>

      <!-- Input -->
      <div class="flex items-center gap-2">
        <input type="text" v-model="text" placeholder="Ask a question">

        <button @click="sendMessage" :disabled="!canSendMessage">
          Send
        </button>
      </div>

    </div>
  </div>
</template>
