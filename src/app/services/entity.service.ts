import { Injectable } from '@angular/core';
import { TaskTypeT } from '../pages/tasks/tasks.model';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor() { }

  tasks: { label: string, value: TaskTypeT, icon: string }[] = [
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

  departments: { label: string; value: string; icon: string }[] = [
    { label: 'Sales',                   value: 'sales',                   icon: 'attach_money'          },
    { label: 'Marketing',               value: 'marketing',               icon: 'campaign'              },
    { label: 'Human Resources',         value: 'humanResources',          icon: 'people'                },
    { label: 'Finance',                 value: 'finance',                 icon: 'account_balance'       },
    { label: 'Customer Support',        value: 'customerSupport',         icon: 'support'               },
    { label: 'IT',                      value: 'it',                      icon: 'memory'                },
    { label: 'Engineering',             value: 'engineering',             icon: 'engineering'           },
    { label: 'Product',                 value: 'product',                 icon: 'widgets'               },
    { label: 'Operations',              value: 'operations',              icon: 'settings'              },
    { label: 'Legal',                   value: 'legal',                   icon: 'gavel'                 },
    { label: 'Procurement',             value: 'procurement',             icon: 'shopping_cart'         },
    { label: 'Logistics',               value: 'logistics',               icon: 'local_shipping'        },
    { label: 'Quality Assurance',       value: 'qualityAssurance',        icon: 'check_circle_outline'  },
    { label: 'Business Development',    value: 'businessDevelopment',     icon: 'trending_up'           },
    { label: 'Research and Development',value: 'researchAndDevelopment',  icon: 'science'               },
    { label: 'Administration',          value: 'administration',          icon: 'admin_panel_settings'  },
    { label: 'Design',                  value: 'design',                  icon: 'brush'                 },
    { label: 'Security',                value: 'security',                icon: 'security'              },
    { label: 'Compliance',              value: 'compliance',              icon: 'verified_user'         },
    { label: 'Training',                value: 'training',                icon: 'school'                },
  ];

}
