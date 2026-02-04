import { PartialType } from "@nestjs/mapped-types";
import { CreateFundiDto } from "./create-fundi.dto";

export class UpdateFundiDto extends PartialType(CreateFundiDto) {}