import { FormFieldConfig } from "../../form-builder/form-builder.model";
import { TaskTypeT, TaskColumnI } from "./tasks.model";
import { DataService } from "../../services/data.service";
import { inject } from "@angular/core";

export class TasksVarsComponent {

  dataService = inject(DataService)
  
  //tasks: { label: string, value: string, icon: string }[] = Tasks;

  columns: TaskColumnI[] = [
    { id: 1, title: 'To Do', tasks: [] },
    { id: 2, title: 'In Progress', tasks: [] },
    { id: 3, title: 'Review', tasks: [] },  
    { id: 4, title: 'Done', tasks: [] }
  ];
  



}