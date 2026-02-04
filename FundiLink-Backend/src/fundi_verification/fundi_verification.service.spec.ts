import { Test, TestingModule } from '@nestjs/testing';
import { FundiVerificationService } from './fundi_verification.service';

describe('FundiVerificationService', () => {
  let service: FundiVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundiVerificationService],
    }).compile();

    service = module.get<FundiVerificationService>(FundiVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
