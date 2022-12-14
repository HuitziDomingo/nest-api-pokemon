import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId, Model } from 'mongoose'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { Pokemon } from './entities/pokemon.entity'
import { PaginationDto } from '../common/dto/paginaion.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
    try {
      let pokemons = await this.pokemonModel.create(createPokemonDto)
      return pokemons

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(pag: PaginationDto) {
    let { limit = 10, offset = 0 } = pag
    return await this.pokemonModel.find().limit(limit).skip(offset).sort({no: 1}).select("-__v")
  }

  async findOne(term: string) {
    let pokemon: Pokemon

    //Verificacion por NO
    if (!isNaN(+term))
      pokemon = await this.pokemonModel.findOne({ no: term })

    //Verificacion MONGO ID 
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term)

    //Verificacion Name
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })

    //Verificacion si NO EXISTE
    if (!pokemon)
      throw new NotFoundException(`Pokemon con ID o Nombre no encontrado: ${term}`)

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon: Pokemon = await this.findOne(term)

    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()

    try {
      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto }

    } catch (error) {
      this.handleExceptions(error)
    }


  }

  async remove(id: string) {
    let { deletedCount } = await this.pokemonModel.deleteOne({ __id: id })
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon con ID: ${id} no encontrado. `)
    return
  }

  /**
   * Logica para manejar los errores
   * @param error 
   */
  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(`Pokemon existente en la base de datos: ${JSON.stringify(error.keyValue)}`)
    console.log(error)
    throw new InternalServerErrorException(`NO se pudo crear pokemon: ${error}`)
  }

}
