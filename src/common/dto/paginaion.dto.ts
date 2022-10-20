import { IsNumber, IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto  {
    
    @IsOptional()
    @IsPositive()
    @Min(1) 
    @IsNumber()
    limit?: number //Simbolo de interogacion sirve para definir un valor opcional
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number

}