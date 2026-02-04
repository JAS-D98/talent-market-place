import { Test, TestingModule } from '@nestjs/testing';
import { FundiApplicationsController } from './fundi_applications.controller';

describe('FundiApplicationsController', () => {
  let controller: FundiApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundiApplicationsController],
    }).compile();

    controller = module.get<FundiApplicationsController>(FundiApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
