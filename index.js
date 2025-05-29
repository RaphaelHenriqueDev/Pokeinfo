import express from 'express'
import ejs from 'ejs'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('home', { pokemon: null, error: null })
})
app.post('/', async (req, res) => {
  const name = req.body.pokemonName

  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    )
    const data = response.data

    const pokemon = {
      name: data.name,
      height: data.height / 10, // em metros
      weight: data.weight / 10, // em kg
      types: data.types.map((t) => t.type.name),
      image: data.sprites.other['official-artwork'].front_default,
    }

    res.render('home', { pokemon, error: null })
  } catch (error) {
    res.render('home', { pokemon: null, error: 'Pokémon não encontrado!' })
  }
})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
