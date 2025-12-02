import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; name: string; password: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { email: data.email, name: data.name, password: hashed },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async list({ skip, take, role }: { skip: number; take: number; role?: any }) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      skip,
      take,
    });
  }

  async update(
    id: number,
    data: Partial<{
      email: string;
      name: string;
      password: string;
      role: string;
    }>
  ) {
    const updateData: any = { ...data };
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      updateData.password = hashed;
    } else {
      delete updateData.password;
    }
    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
