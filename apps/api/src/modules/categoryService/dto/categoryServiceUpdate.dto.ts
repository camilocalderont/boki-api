import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryServiceDto {
    @IsString()
    @IsOptional()
    VcName?: string;
}
