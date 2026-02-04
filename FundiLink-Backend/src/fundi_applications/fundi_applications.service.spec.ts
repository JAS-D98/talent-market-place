import { Test, TestingModule } from '@nestjs/testing';
import { FundiApplicationsService } from './fundi_applications.service';

describe('FundiApplicationsService', () => {
  let service: FundiApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundiApplicationsService],
    }).compile();

    service = module.get<FundiApplicationsService>(FundiApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
