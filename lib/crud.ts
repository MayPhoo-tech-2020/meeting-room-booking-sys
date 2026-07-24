export function createCrud(model: any) {

  return {

    findMany: () => {
      return model.findMany();
    },


    findUnique: (id: string) => {
      return model.findUnique({
        where: { id }
      });
    },


    create: (data: any) => {
      return model.create({
        data
      });
    },


    update: (id: string, data: any) => {
      return model.update({
        where: { id },
        data
      });
    },


    delete: (id: string) => {
      return model.delete({
        where: { id }
      });
    }

  };

}