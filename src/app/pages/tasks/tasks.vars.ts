import { FormFieldConfig } from "../../form-builder/form-builder.model";
import { TaskTypeT, TaskColumnI } from "./tasks.model";
import { DataService } from "../../services/data.service";
import { inject } from "@angular/core";

export const Tasks: { label: string, value: TaskTypeT, icon: string }[] = [
  { label: "Call", value: "call", icon: "phone" },
  { label: "Email", value: "email", icon: "email" },
  { label: "Meeting", value: "meeting", icon: "event" },
  { label: "Follow-up", value: "followUp", icon: "repeat" },
  { label: "Proposal/Quote", value: "proposal", icon: "description" },
  { label: "Onboarding", value: "onboarding", icon: "rocket_launch" },
  { label: "Support Request", value: "supportRequest", icon: "build" },
  { label: "Contract Signing", value: "contractSigning", icon: "edit_document" },
  { label: "Renewal Reminder", value: "renewalReminder", icon: "autorenew" },
  { label: "Payment Follow-up", value: "paymentFollowUp", icon: "payment" },
  { label: "Survey Request", value: "surveyRequest", icon: "poll" },
  { label: "Internal Note", value: "internalNote", icon: "note" },
  { label: "Lead Qualification", value: "leadQualification", icon: "track_changes" },
  { label: "Marketing Task", value: "marketingTask", icon: "campaign" },
  { label: "Birthday/Anniversary Reminder", value: "birthdayReminder", icon: "cake" },
  { label: "Product Demo", value: "productDemo", icon: "computer" },
  { label: "Account Review", value: "accountReview", icon: "insights" },
  { label: "Training Session", value: "trainingSession", icon: "school" }
];

export class TasksVarsComponent {

  dataService = inject(DataService)
  
  tasks: { label: string, value: TaskTypeT, icon: string }[] = Tasks;

  columns: TaskColumnI[] = [
    { id: 1, title: 'To Do', tasks: [] },
    { id: 2, title: 'In Progress', tasks: [] },
    { id: 3, title: 'Review', tasks: [] },  
    { id: 4, title: 'Done', tasks: [] }
  ];
  
  taskBaseFields: FormFieldConfig[] = [
    { type: 'text', name: 'subject', label: 'Subject', required: true, validators: { minLength: 3, maxLength: 100 }, columns: 1 },
    { type: 'select', name: 'priority', label: 'Priority', required: true, multiple: false, listName: 'Priority', columns: 2 },
    { type: 'date', name: 'dueDate', label: 'Due Date', required: false, columns: 2 },
    { type: 'textarea', name: 'notes', label: 'Notes', required: false, validators: { minLength: 0, maxLength: 500 }, columns: 1 },
    { type: 'autocomplete', name: 'assignee', label: 'Assignee', required: true, dynamicOptions: this.dataService.getEmployeeOptions(), columns: 1 },
  ];
  
  taskTypeFields: Record<TaskTypeT, FormFieldConfig[]> = {
    
    call: [
      ...this.taskBaseFields,
      { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2 },
      { type: 'select', name: 'callOutcome', label: 'Call Outcome', required: false, multiple: false, listName: 'Call Outcome', columns: 2 },
    ],
    email: [
      ...this.taskBaseFields,
      { type: 'email', name: 'emailAddress', label: 'Email Address', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 1 },
      { type: 'textarea', name: 'emailBody', label: 'Email Body', required: true, columns: 1 },
    ],
    meeting: [
      ...this.taskBaseFields,
      { type: 'text', name: 'location', label: 'Location/Link', required: false, columns: 2 },
      { type: 'number', name: 'duration', label: 'Duration (minutes)', required: false, columns: 2 },
      { type: 'textarea', name: 'agenda', label: 'Agenda', required: false, columns: 1 },
    ],
    followUp: [
      ...this.taskBaseFields,
      { type: 'text', name: 'relatedLead', label: 'Related Lead/Opportunity', required: false, columns: 1 },
    ],
    proposal: [
      ...this.taskBaseFields,
      { type: 'text', name: 'amount', label: 'Proposal Amount', required: true, columns: 2 },
      { type: 'text', name: 'proposalLink', label: 'Proposal Link', required: false, columns: 2 },
      { type: 'date', name: 'expirationDate', label: 'Expiration Date', required: false, columns: 2 },
    ],
    onboarding: [
      ...this.taskBaseFields,
      { type: 'select', name: 'onboardingStep', label: 'Onboarding Step', required: false, multiple: false, listName: 'Onboarding Steps', columns: 1 },
      { type: 'date', name: 'startDate', label: 'Start Date', required: false, columns: 2 },
      { type: 'date', name: 'endDate', label: 'End Date', required: false, columns: 2 },
    ],
    supportRequest: [
      ...this.taskBaseFields,
      { type: 'textarea', name: 'issueDescription', label: 'Issue Description', required: true, columns: 1 }
    ],
    contractSigning: [
      ...this.taskBaseFields,
      { type: 'text', name: 'contractLink', label: 'Contract Link', required: true, columns: 2 },
      { type: 'select', name: 'signingStatus', label: 'Signing Status', required: true, multiple: false, listName: 'Signing Statuses', columns: 2 },
      { type: 'date', name: 'deadline', label: 'Deadline', required: false, columns: 2 },
    ],
    renewalReminder: [
      ...this.taskBaseFields,
      { type: 'date', name: 'renewalDate', label: 'Renewal Date', required: true, columns: 2 },
      { type: 'text', name: 'amount', label: 'Renewal Amount', required: false, columns: 2 },
    ],
    paymentFollowUp: [
      ...this.taskBaseFields,
      { type: 'text', name: 'invoiceNumber', label: 'Invoice Number', required: true, columns: 2 },
      { type: 'text', name: 'amountDue', label: 'Amount Due', required: true, columns: 2 },
    ],
    surveyRequest: [
      ...this.taskBaseFields,
      { type: 'text', name: 'surveyLink', label: 'Survey Link', required: true, columns: 2 },
      { type: 'date', name: 'sendDate', label: 'Send Date', required: true, columns: 2 },
    ],
    internalNote: [
      ...this.taskBaseFields,
      { type: 'textarea', name: 'noteBody', label: 'Note', required: true, columns: 1 },
    ],
    leadQualification: [
      ...this.taskBaseFields,
      { type: 'select', name: 'qualificationStatus', label: 'Qualification Status', required: false, multiple: false, listName: 'Lead Qualification', columns: 1 },
    ],
    marketingTask: [
      ...this.taskBaseFields,
      { type: 'text', name: 'campaignName', label: 'Campaign Name', required: true, columns: 2 },
      { type: 'select', name: 'taskType', label: 'Task Type', required: true, multiple: false, listName: 'Marketing Task Type', columns: 2 },
      { type: 'date', name: 'scheduledDate', label: 'Scheduled Date', required: true, columns: 2 },
    ],
    birthdayReminder: [
      ...this.taskBaseFields,
      { type: 'select', name: 'occasionType', label: 'Occasion Type', required: true, multiple: false, listName: 'Occasion Type', columns: 2 },
      { type: 'date', name: 'date', label: 'Date', required: true, columns: 2 },
    ],
    productDemo: [
      ...this.taskBaseFields,
      { type: 'text', name: 'demoLink', label: 'Demo Link', required: false, columns: 2 },
      { type: 'date', name: 'scheduledDate', label: 'Scheduled Date', required: true, columns: 2 },
    ],
    accountReview: [
      ...this.taskBaseFields,
      { type: 'date', name: 'reviewDate', label: 'Review Date', required: true, columns: 2 },
      { type: 'text', name: 'assignedRep', label: 'Assigned Representative', required: false, columns: 2 },
    ],
    trainingSession: [
      ...this.taskBaseFields,
      { type: 'text', name: 'trainingTopic', label: 'Training Topic', required: true, columns: 2 },
      { type: 'text', name: 'trainer', label: 'Trainer', required: false, columns: 2 },
      { type: 'date', name: 'trainingDate', label: 'Training Date', required: true, columns: 2 },
    ],
  };

}