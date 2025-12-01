import { PartialType } from "@nestjs/mapped-types";
import { CreatePembinaanDto } from "./create-pembinaan.dto";

export class UpdatePembinaanDto extends PartialType(CreatePembinaanDto) {}
