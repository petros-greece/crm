import { FormFieldConfig } from "../../form-builder/form-builder.model";

export const Departments: { label: string; value: string; icon: string }[] = [
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

export const roles: Record<string, string[]> = {
  sales: [
    'Sales Representative',
    'Account Executive',
    'Sales Manager',
    'Business Development Representative',
    'Territory Sales Lead'
  ],
  marketing: [
    'Marketing Coordinator',
    'Content Strategist',
    'SEO Specialist',
    'Brand Manager',
    'Digital Marketing Analyst'
  ],
  humanResources: [
    'HR Generalist',
    'Recruiter',
    'HR Manager',
    'Talent Acquisition Specialist',
    'Compensation & Benefits Analyst'
  ],
  finance: [
    'Financial Analyst',
    'Accountant',
    'Finance Manager',
    'Controller',
    'Billing Specialist'
  ],
  customerSupport: [
    'Support Representative',
    'Customer Success Manager',
    'Technical Support Engineer',
    'Help Desk Analyst',
    'Support Team Lead'
  ],
  it: [
    'IT Support Specialist',
    'System Administrator',
    'Network Engineer',
    'IT Manager',
    'Desktop Support Technician'
  ],
  engineering: [
    'Software Engineer',
    'QA Engineer',
    'DevOps Engineer',
    'Engineering Manager',
    'Embedded Systems Engineer'
  ],
  product: [
    'Product Manager',
    'Product Owner',
    'UX Researcher',
    'Product Analyst',
    'Technical Product Manager'
  ],
  operations: [
    'Operations Manager',
    'Process Engineer',
    'Logistics Coordinator',
    'Operations Analyst',
    'Facilities Manager'
  ],
  legal: [
    'Corporate Counsel',
    'Paralegal',
    'Legal Operations Manager',
    'Compliance Officer',
    'Contracts Manager'
  ],
  procurement: [
    'Procurement Specialist',
    'Purchasing Manager',
    'Vendor Manager',
    'Supply Chain Analyst',
    'Category Buyer'
  ],
  logistics: [
    'Logistics Manager',
    'Shipment Coordinator',
    'Warehouse Supervisor',
    'Distribution Analyst',
    'Inventory Control Specialist'
  ],
  qualityAssurance: [
    'QA Analyst',
    'Quality Engineer',
    'Test Automation Engineer',
    'QA Manager',
    'Quality Control Inspector'
  ],
  businessDevelopment: [
    'BD Representative',
    'Partnership Manager',
    'Strategic Alliances Director',
    'Market Research Analyst',
    'Growth Strategist'
  ],
  researchAndDevelopment: [
    'R&D Engineer',
    'Research Scientist',
    'Product Innovation Lead',
    'Laboratory Technician',
    'R&D Project Manager'
  ],
  administration: [
    'Office Administrator',
    'Executive Assistant',
    'Facilities Coordinator',
    'Administrative Manager',
    'Receptionist'
  ],
  design: [
    'Graphic Designer',
    'UX/UI Designer',
    'Creative Director',
    'Visual Designer',
    'Interaction Designer'
  ],
  security: [
    'Security Analyst',
    'Security Engineer',
    'Chief Information Security Officer',
    'Access Control Specialist',
    'Security Operations Center (SOC) Analyst'
  ],
  compliance: [
    'Compliance Analyst',
    'Regulatory Affairs Specialist',
    'Compliance Manager',
    'Risk Manager',
    'Internal Auditor'
  ],
  training: [
    'Training Coordinator',
    'Learning & Development Specialist',
    'Corporate Trainer',
    'Instructional Designer',
    'Training Manager'
  ]
};

export function getDepartmentsWithRoles(): { label: string; value: string; icon: string; roles: any[] }[] {
  return Departments.map(dep => ({
    ...dep,
    roles: roles[dep.value].map(r=>{return {role:r}}) || []
  }));
}

export class DepartmentsVars {
  departments = getDepartmentsWithRoles();

  departmentBaseFields: FormFieldConfig[] = [
    { type: 'text', name: 'label', label: 'Name', required: true, validators: { minLength: 3, maxLength: 100 }, columns: 2 },
    { type: 'icon', name: 'icon', label: 'Select Icon', required: true, columns: 2 },
    {
      type: 'multi-row',
      addRow: 'Add Role',
      name: 'roles',
      label: 'Department Roles',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          type: 'text',
          name: 'role',
          label: 'Role Name',
          required: true,
        }
      ]
    },    
  ];

}