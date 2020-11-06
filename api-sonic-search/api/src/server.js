const express = require('express');
const { v4: uuid } = require('uuid');
const { Ingest, Search } = require('sonic-channel')

const sonicIngest = new Ingest({
  host: 'localhost',
  port: 1491,
  auth: 'SecretPassword'
})

sonicIngest.connect({
  connected: () => {
    console.log('connected Ingest')
  }
})

const sonicSearch = new Search({
  host: 'localhost',
  port: 1491,
  auth: 'SecretPassword'
})

sonicSearch.connect({
  connected: () => {
    console.log('connected Search')
  }
})

const app = express()
app.use(express.json())

app.post('/posts', async(req, res) => {
  const { title, content } = req.body;
  const id = uuid();

  await sonicIngest.push('posts', 'default', `post:${id}`, `${title} ${content}`, {
    lang: 'por'
  })

  return res.json({ title, content, id })
});


app.get('/search', async(req, res) => {
  const { q } = req.query;

  const result = await sonicSearch.query('posts', 'default', q, {
    lang: 'por'
  });

  return res.json(result)
});


app.get('/suggest', async(req, res) => {
  const { q } = req.query;

  console.log(q)

  const result = await sonicSearch.suggest('posts', 'default', q, { limit: 5 })

  return res.json(result)
});

app.listen(5000, () => {
  console.log('Server Start.')
})