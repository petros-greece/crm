import { TestBed } from '@angular/core/testing';

import { EntityFieldsService } from './entity-fields.service';

describe('EntityFieldsService', () => {
  let service: EntityFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
