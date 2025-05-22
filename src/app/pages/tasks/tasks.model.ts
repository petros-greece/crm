export interface TaskItemI { 
  label: string, 
  value: string, 
  icon: string 
}

export interface TaskI {
  type: any;
  data?:any
}

export interface TaskColumnI {
  id: number | string;
  title: string;
  tasks: TaskI[];
}
