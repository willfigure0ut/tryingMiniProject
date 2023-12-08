const express = require('express');
const OpenAI = require('openai');
const axios = require('axios');
const GoogleImages = require('google-images');
const cors = require('cors')
const app = express();
app.use(cors())



const client = new GoogleImages('52673c0f180864dd5', 'AIzaSyD5_JRWvxUmJI89aifEgJXHXIt_uaB2yHw');
const openai = new OpenAI({ apiKey: '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' });
async function getResponse(prompt) {
  const response = await openai.completions.create({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 60
  });

  return response.choices[0].text;
}





app.get('/search', async (req, res) => {
  try {
    let answer;
    const options = {
      method: 'POST',
      url: 'https://api.cohere.ai/v1/generate',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer 1Ii4zBBPEZiuEkN0xutodWl6AZOkxureTf4Tq5HR'
      },
      data: {
        truncate: 'END',
        return_likelihoods: 'NONE',
        prompt: `${req.query.search}`
      }
    };
    await axios.request(options)
      .then(function (response) {
        answer = response.data.generations[0].text;
      });

    const response = await getResponse(`can you give me only the best image prompt for searching on google images neither any link of the image nor anything in the response other than the prompt itself for the question ${req.query.search}`);
    console.log(response);
    const searchTerm = response;
    const results = await client.search(searchTerm);
    let image = results.slice(0, 1);
    const output = {
      answer: answer,
      image: image
    };
    res.send(output);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));