import { IsNotEmpty, IsNumberString } from 'class-validator';
export class CreateTestDto {
    @IsNotEmpty()
    name: string;
    @IsNumberString()
    @IsNotEmpty()
    age: number;
    @IsNotEmpty()
    breed: string;
}
