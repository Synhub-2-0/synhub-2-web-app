import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AnalyticsLeaderComponent} from '../../components/analytics-leader/analytics-leader.component';


describe('AnalyticsLeaderComponent', () => {
  let component: AnalyticsLeaderComponent;
  let fixture: ComponentFixture<AnalyticsLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsLeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
