import { Test, TestingModule } from '@nestjs/testing';
import { FundiVerificationController } from './fundi_verification.controller';

describe('FundiVerificationController', () => {
  let controller: FundiVerificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundiVerificationController],
    }).compile();

    controller = module.get<FundiVerificationController>(FundiVerificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
