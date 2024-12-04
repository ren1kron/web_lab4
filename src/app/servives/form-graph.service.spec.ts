import { TestBed } from '@angular/core/testing';

import { FormGraphService } from './form-graph.service';

describe('FormGraphService', () => {
  let service: FormGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
