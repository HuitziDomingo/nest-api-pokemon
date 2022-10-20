import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import axios, { AxiosInstance } from 'axios'

import { Pokemon } from 'src/pokemon/entities/pokemon.entity'
import { PokeResponse } from './interfaces/poke-response.interface'
import { PokemonDataType } from './interfaces/data-poke.interface'

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }

  private readonly axios: AxiosInstance = axios


  async executeSeed() {
    await this.pokemonModel.deleteMany({})// delete * from pokemons

    let { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    let pokemonToInsert: PokemonDataType [] = []

    // data.results.map(result => console.log(result)) //sacar la data con un map
    data.results.forEach(async ({ name, url }) => {
      let segment = url.split('/')
      let no = +segment.at(-2)// let no = +segment[segment.length - 1]

      pokemonToInsert.push({ name, no }) // [{name: bulbasur, no: 1}]

    })

    await this.pokemonModel.insertMany(pokemonToInsert)//INSERT INTO pokemons (name, no)

    return 'seed executed'
  }

}
