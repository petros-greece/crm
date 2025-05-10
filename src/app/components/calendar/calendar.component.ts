import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  CalendarModule, 
  CalendarEvent, 
  CalendarView, 
  CalendarUtils, 
  DateAdapter, 
  CalendarA11y, 
  CalendarEventTitleFormatter, 
  CalendarMonthViewDay,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarDateFormatter, CalendarNativeDateFormatter } from 'angular-calendar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule, MatButtonModule, MatIconModule, DragDropModule],
  providers: [
    CalendarUtils,
    { provide: DateAdapter, useFactory: adapterFactory }, 
    { provide: CalendarDateFormatter, useClass: CalendarNativeDateFormatter }, 
    CalendarA11y, 
    CalendarEventTitleFormatter
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  @Input() events: CalendarEvent[] = [
    {
      start: new Date(),
      end: new Date(new Date().getTime()+10*99),
      title: 'Doctor Appointment',
      color: { primary: 'red', secondary: '#D1E8FF' },
      draggable: true
    },
    {
      start: new Date(new Date().setDate(new Date().getDate() + 3)),
      title: 'Follow-up Visit',
      color: { primary: '#ff4081', secondary: '#F8BBD0' }
    }
  ];
  
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView;


  handleDayClick(event: { day: CalendarMonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }) {
    console.log(event)
    const { date, events } = event.day;
    // handle the day click event with date and events
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked:', event);
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    console.log('Event dragged', event, newStart, newEnd);
    
    this.events = this.events.map((iEvent) => {
      if (iEvent.id === event.id) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    
    // Here you would typically update your backend
    // this.saveEventsToBackend();
  }


}
