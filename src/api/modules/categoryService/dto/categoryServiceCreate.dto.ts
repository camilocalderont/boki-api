import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryServiceDto {
    @IsString()
    @IsNotEmpty({ message: 'Category name is required' })
    VcName: string;
}
