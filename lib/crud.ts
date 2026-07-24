import { prisma } from "./prisma";

export async function getAll(
  model: keyof typeof prisma,
  options?: any
) {
  const dbModel = prisma[model] as any;

  return dbModel.findMany(options);
}


export async function getById(
  model: keyof typeof prisma,
  id: string
) {
  const dbModel = prisma[model] as any;

  return dbModel.findUnique({
    where: {
      id,
    },
  });
}


export async function create(
  model: keyof typeof prisma,
  data: any
) {
  const dbModel = prisma[model] as any;

  return dbModel.create({
    data,
  });
}


export async function update(
  model: keyof typeof prisma,
  id: string,
  data: any
) {
  const dbModel = prisma[model] as any;

  return dbModel.update({
    where: {
      id,
    },
    data,
  });
}


export async function remove(
  model: keyof typeof prisma,
  id: string
) {
  const dbModel = prisma[model] as any;

  return dbModel.delete({
    where: {
      id,
    },
  });
}