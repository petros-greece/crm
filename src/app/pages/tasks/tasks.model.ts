export type TaskTypeT =
  | 'call'
  | 'email'
  | 'meeting'
  | 'followUp'
  | 'proposal'
  | 'onboarding'
  | 'supportRequest'
  | 'contractSigning'
  | 'renewalReminder'
  | 'paymentFollowUp'
  | 'surveyRequest'
  | 'internalNote'
  | 'leadQualification'
  | 'marketingTask'
  | 'birthdayReminder'
  | 'productDemo'
  | 'accountReview'
  | 'trainingSession';

export interface TaskItemI { 
  label: string, 
  value: TaskTypeT, 
  icon: string 
}

export interface TaskI {
  type: TaskItemI;
  data?:any
}

export interface TaskColumnI {
  id: number | string;
  title: string;
  tasks: TaskI[];
}
