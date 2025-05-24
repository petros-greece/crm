import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { DataService } from '../../services/data.service';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { DialogService } from './../../components/dialog/dialog.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { MatIcon } from '@angular/material/icon';
import { ColumnTemplateDirective, TableBuilderComponent, TableConfig } from '../../table-builder/table-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calendar-and-scheduling',
  imports: [
    CommonModule, 
    CalendarComponent, 
    TaskFormComponent,
    MatIcon,
    MatButtonModule,
    TableBuilderComponent,
    ColumnTemplateDirective
  ],
  templateUrl: './calendar-and-scheduling.component.html',
  styleUrl: './calendar-and-scheduling.component.scss'
})
export class CalendarAndSchedulingComponent implements OnInit {

  private destroy$ = new Subject<void>();

  @ViewChild('dayTmpl', { static: true }) dayTmpl!: TemplateRef<any>;
  @ViewChild('eventTmpl', { static: true }) eventTmpl!: TemplateRef<any>;

  dataService = inject(DataService);
  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService);

  calendarEvents: CalendarEvent[] = [];
  selectedTaskMeta: any = {};
  dayEventsTableConfig!: TableConfig; 

  ngOnInit(): void {
    this.dataService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((taskColumns: any[]) => {
        this.calendarEvents = this.transformTaskColumnsToCalendarEvents(taskColumns);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private transformTaskColumnsToCalendarEvents(taskColumns: any[]): CalendarEvent[] {
    const tasks = taskColumns.reduce((acc, column) => {
      return acc.concat(column.tasks);  
    }
    , []);
    return tasks.map( (task:any) => this.transformTaskToCalendarEvent(task));
  }

  private transformTaskToCalendarEvent(task: any):CalendarEvent {
    return {
      id: task.data.id,
      start: new Date(task.data.dueDate),
      title: task.data.subject,
      draggable: true,
      meta: task
    };
  }

  private formatDate(date: Date): string {
    const parts = date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).split(' ');
  
    // Insert comma after weekday
    return `${parts[0]}, ${parts.slice(1).join(' ')}`;
  }

  private openEditEventDialog(type: any) {
    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      cls: 'bg-violet-800 !text-white',
      content: this.eventTmpl,
      header: `${type.label}`,
      icon: type.icon,
      id: 'edit-event'
    });
  }

  private modifyEventsForDayTable(events:any, employees:any){
    return events.map((event:any) => {
      const assigneeId = event.meta?.data?.assignee;
      const assignee = employees.find((e:any) => Number(e.value) === Number(assigneeId));
      return {
        icon: event.meta.type.icon, 
        subject: event.meta.data.subject, 
        assignee:assignee ? assignee.label : null, 
        edit: event.meta
      };
    });
  }

  private giveDayEventsTableConfig(modifiedEvents:any):TableConfig{
    return {
      data: modifiedEvents,
      columns: [
        {key: 'icon', label: 'Type', type: 'custom'},
        {key: 'subject', label: 'Subject', type: 'text'},
        {key: 'assignee', label: 'Assignee', type: 'text'}, 
        {key: 'edit', label: 'Edit', type: 'custom'},                
      ],
      hideButtons: true,
      pagination: false,
    }
  }

  afterSumbitEvent(taskColumns:any){
    this.calendarEvents = this.transformTaskColumnsToCalendarEvents(taskColumns);
    //this.dialogService.closeDialogById('edit-event');
    //console.log(this.calendarEvents);
    this.dialogService.closeAll();
  }

  onEditTask(task: any) {
    this.selectedTaskMeta = JSON.parse(JSON.stringify(task.edit));
    delete this.selectedTaskMeta.data.assigneeName;
    this.openEditEventDialog(task.edit.type);
  }

  onDayClicked(dayData: any ) {
    this.dataService.getEmployeeOptions().subscribe((employees: any[]) => {
      const modifiedEvents = this.modifyEventsForDayTable(dayData.events, employees)
      this.dayEventsTableConfig = this.giveDayEventsTableConfig(modifiedEvents);
      this.dialogService.openTemplate({
        content: this.dayTmpl,
        header: this.formatDate(dayData.date),
        cls: 'bg-violet-800 !text-white',
        icon: 'calendar_month',
      })
    })
  }

  onEventClicked(event: CalendarEvent) {  
    this.selectedTaskMeta = event.meta;
    this.openEditEventDialog(event.meta.type);
  }

  onEventTimesChanged(event:CalendarEventTimesChangedEvent){
    let task = event.event.meta;
    const localDate = new Date(event.newStart);
    task.data.dueDate = localDate.toISOString();
    this.dataService.updateTask(task).subscribe((response) => {
      this.snackbarService.showSnackbar(`Task "${task.data.subject}" updated successfully`);
    });

  }







}
