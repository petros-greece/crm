import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  CalendarEventTimesChangedEvent,
  CalendarEventTimesChangedEventType
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarDateFormatter, CalendarNativeDateFormatter } from 'angular-calendar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

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

  @Input() events: CalendarEvent[] = [];
  @Output() onDayClicked: EventEmitter<CalendarMonthViewDay<any>> = new EventEmitter<CalendarMonthViewDay<any>>();
  @Output() onEventTimesChanged: EventEmitter<CalendarEventTimesChangedEvent> = new EventEmitter<CalendarEventTimesChangedEvent>();
  @Output() onEventClicked: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView;


  dayClicked(event: { day: CalendarMonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }) {
    console.log(event)
    const { date, events } = event.day;
    this.onDayClicked.emit(event.day);
    // handle the day click event with date and events
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked:', event);
    this.onEventClicked.emit(event);
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    //console.log('Event dragged', event, newStart, newEnd);
    
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
    
    this.onEventTimesChanged.emit({
      type: CalendarEventTimesChangedEventType.Drop,
      event: event,
      newStart,
      newEnd,
    });

  }

  previous(): void {
    switch (this.view) {
      case CalendarView.Month:
        this.viewDate = subMonths(this.viewDate, 1);
        break;
      case CalendarView.Week:
        this.viewDate = subWeeks(this.viewDate, 1);
        break;
      case CalendarView.Day:
        this.viewDate = subDays(this.viewDate, 1);
        break;
    }
  }
  
  next(): void {
    switch (this.view) {
      case CalendarView.Month:
        this.viewDate = addMonths(this.viewDate, 1);
        break;
      case CalendarView.Week:
        this.viewDate = addWeeks(this.viewDate, 1);
        break;
      case CalendarView.Day:
        this.viewDate = addDays(this.viewDate, 1);
        break;
    }
  }


}
