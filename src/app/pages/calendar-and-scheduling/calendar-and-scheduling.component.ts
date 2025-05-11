import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { DataService } from '../../services/data.service';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-calendar-and-scheduling',
  imports: [CommonModule, CalendarComponent, TaskFormComponent],
  templateUrl: './calendar-and-scheduling.component.html',
  styleUrl: './calendar-and-scheduling.component.scss'
})
export class CalendarAndSchedulingComponent implements OnInit {

  @ViewChild('dayTmpl', { static: true }) dayTmpl!: TemplateRef<any>;
  @ViewChild('eventTmpl', { static: true }) eventTmpl!: TemplateRef<any>;


  dataService = inject(DataService);
  dialogService = inject(DialogService);

  calendarEvents: CalendarEvent[] = [];

  selectedTaskMeta: any = {};

  ngOnInit(): void {
    this.dataService.getTasks().subscribe((taskColumns: any[]) => {
      const tasks = taskColumns.reduce((acc, column) => {
        return acc.concat(column.tasks);  
      }
      , []);
      this.calendarEvents = tasks.map( (task:any) => this.transformTaskToCalendarEvent(task));
      console.log(this.calendarEvents);
      
    });
  }

  onDayClicked(event: any) {
    console.log('Day clicked:', event); 
    this.dialogService.openTemplate({
      content: this.dayTmpl,
      header: 'Day Details',
    })
  }

  onEventClicked(event: CalendarEvent) {
    console.log('Event clicked:', event);

    this.selectedTaskMeta = event.meta;
    //console.log(this.selectedTaskMeta);
    //return;

    this.dialogService.openTemplate({
    panelClass: 'responsive-dialog',
    cls: 'bg-violet-800 !text-white',
      content: this.eventTmpl,
      header: `${event.meta.type.label}`,
      icon: event.meta.type.icon,
    })


  }

  onEventTimesChanged(event:CalendarEventTimesChangedEvent){
    console.log('Event times changed:', event);
    let task = event.event.meta;
    const localDate = new Date(event.newStart);
    task.data.dueDate = localDate.toISOString();
    this.dataService.updateTask(task).subscribe((response) => {

    });

  }

  transformTaskToCalendarEvent(task: any):CalendarEvent {
    return {
      id: task.data.id,
      start: new Date(task.data.dueDate),
      title: task.data.subject,
      draggable: true,
      meta: task
    };
  }




}
