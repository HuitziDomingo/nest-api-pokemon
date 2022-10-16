import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface'

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios


  async executeSeed() {
    let { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    // data.results.map(result => console.log(result)) //sacar la data con un map
    data.results.forEach(({name, url}) =>  {
      let segment = url.split('/')
      let no = +segment.at(-2)
      console.log({name,no})
    })

    return data.results
  }

}
