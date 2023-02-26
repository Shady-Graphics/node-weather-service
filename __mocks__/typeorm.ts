module.exports = {
  getRepository: jest.fn().mockReturnValue({
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn(),
      addSelect: jest.fn(),
      where: jest.fn(),
      groupBy: jest.fn(),
      getRawMany: jest.fn(),
    }),
  }),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  CreateDateColumn: jest.fn(),
  UpdateDateColumn: jest.fn(),
};
