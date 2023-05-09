#!/usr/bin/env node

const { Configuration, OpenAIApi } = require('openai');

const rl = require('readline-sync');
const loading =  require('loading-cli');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

(async () => {
  if (!process.env.OPENAI_API_KEY)  {
    console.log('OPENAI_API_KEY environment variable is not set.');
    process.exit(1);
  }

  let messages = [];

  while(true) {
    let input = rl.question("openai > ");

    if (input) {
      messages.push({ role: "user", content: input });

      const spinner = loading('Loading...').start();

      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-4",
          messages,
        });

        let reply = completion.data.choices[0].message?.content;
        messages.push({ role: "assistant", content: reply });

        spinner.stop();
        console.log(reply);
      } catch (error) {
        spinner.stop(); // Stop the spinner even if there's an error
        console.error('Error loading:', error.message);
      }
    }
  }
})();
