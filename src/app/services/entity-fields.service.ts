import { inject, Injectable } from '@angular/core';
import { FormFieldConfig } from '../form-builder/form-builder.model';
import { TableColumn } from '../table-builder/table-builder.component';
import { of } from 'rxjs';
import { TaskTypeT } from '../pages/tasks/tasks.model';
import { DataService } from './data.service';
import { DepartmentI } from '../pages/departments/departments.vars';

@Injectable({
  providedIn: 'root'
})
export class EntityFieldsService {

  dataService = inject(DataService)
  departments: any = [];
  constructor() {
    this.dataService.getDepartments().subscribe(d => this.departments = d)
  }

  defaultEntites = [
    'employee',
    'customer',
    'department',
    'role',
    'task',
    'product',
    'product category',
    'campaign',
  ];

  dateAndNoteMultiRowField:FormFieldConfig = {
    type: 'multi-row', name: 'notes', label: 'Notes', addRow: 'Add Note', columns: 1, defaultValue: [], fields: [
      { type: 'date', name: 'date', label: 'Date', required: false },
      { type: 'textarea', name: 'note', label: 'Note', required: false },
    ]
  }

  /** PERSON ******************************************************************************** */

  personBaseFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: 'ID', columns: 1, },
    { type: 'text', name: 'fullName', label: 'Full Name', required: true, validators: { minLength: 3, maxLength: 40, }, columns: 2, },
    { type: 'email', name: 'email', label: 'Email Address', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 2, },
    { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2, },
    { type: 'date', name: 'birthDate', label: 'Date of Birth', required: false, columns: 2, },
    { type: 'text', name: 'address', label: 'Address', required: true, validators: { minLength: 5, maxLength: 100 }, columns: 2, },
    { type: 'text', name: 'city', label: 'City', required: true, validators: { minLength: 2, maxLength: 50 }, columns: 2, },
    { type: 'text', name: 'zipCode', label: 'Zip/Postal Code', required: true, validators: { pattern: '^[0-9]{5}(?:-[0-9]{4})?$' }, columns: 2, },
  ]

  employeeFields: FormFieldConfig[] = [
    ...this.personBaseFields,
    { type: 'date', name: 'hireDate', label: 'Date of Hire', required: true, columns: 2, },
    { type: 'select', name: 'department', label: 'Department', required: true, multiple: false, dynamicOptions: this.dataService.getDepartmentOptions(), columns: 2, },
    {
      type: 'select', name: 'role', label: 'Role', required: true, multiple: false,
      dependsOn: {
        fieldName: 'department',
        updateOptions: (departmentValue: string) => {
          const department = this.departments.find((d: DepartmentI) => d.label === departmentValue);
          return of((department?.roles || []).map(((r:{role:string}) => ({ label: r.role, value: r.role }))));
        }
      },
      columns: 2
    },
    { type: 'slide-toggle', name: 'isActive', label: 'Is Active?', required: false, columns: 1, defaultValue: true },
    { type: 'select', name: 'crmRole', label: 'CRM Role', dynamicOptions: this.dataService.getRoleOptions(), required: true}
  ];


  /** COMPANY ******************************************************************************** */

  companyFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: 'ID', columns: 1 },
    { type: 'text', name: 'companyName', label: 'Company Name', required: true, validators: { minLength: 2, maxLength: 100 }, columns: 2 },
    { type: 'select', name: 'relations', label: 'Relations', required: true, multiple: true, listName: 'Company Relations', columns: 2 },
    { type: 'email', name: 'email', label: 'Email', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 2 },
    { type: 'text', name: 'phoneNumber', label: 'Main Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2 },
    { type: 'text', name: 'website', label: 'Website', required: false, validators: { pattern: '^(https?:\\/\\/)?([\\w\\-])+\\.([\\w\\-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?$' }, columns: 2 },
    { type: 'select', name: 'industry', label: 'Industry', required: false, multiple: false, listName: 'Industry', columns: 2 },
    { type: 'select', name: 'employeeCount', label: 'Number of Employees', required: false, listName: 'Company Size', columns: 2 },
    { type: 'text', name: 'address', label: 'Address', required: true, validators: { minLength: 5, maxLength: 100 }, columns: 2 },
    { type: 'text', name: 'city', label: 'City', required: true, validators: { minLength: 2, maxLength: 50 }, columns: 2 },
    { type: 'text', name: 'zipCode', label: 'Zip/Postal Code', required: true, validators: { pattern: '^[0-9]{5}(?:-[0-9]{4})?$' }, columns: 2 },
    { type: 'autocomplete', name: 'country', label: 'Country', required: true, listName: 'Country',columns: 2 },
    { type: 'slide-toggle', name: 'isActive', label: 'Is Active?', required: true, columns: 1, defaultValue: true },
  ];

  companyTabFields: { [tab: string]: FormFieldConfig[] } = {
    contacts: [
      {
        type: 'multi-row', name: 'contacts', label: 'Contacts', addRow: 'Add Contact', fields: [
          { type: 'text', name: 'name', label: 'Name', columns: 2 },
          {
            type: 'select',
            name: 'communication-type',
            label: 'Preffered Contact Type',
            options: [
              { label: 'Phonecall', value: 'phonecall' },
              { label: 'Email', value: 'email' },
              { label: 'sms', value: 'sms' },
              { label: 'Social Apps', value: 'social-apps' }
            ],
            columns: 1
          },
          { type: 'text', name: 'email', label: 'Email', validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 4 },
          { type: 'text', name: 'phone', label: 'Phone', validators: { pattern: '^\\+?[0-9\\s\\-()]{7,20}$' }, columns: 4 },
          { type: 'text', name: 'socialLink', label: 'Social Link', validators: { pattern: '^(https?:\\/\\/)?([\\w.-]+)\\.([a-z\\.]{2,6})([\\/\\w .-]*)*\\/?$' }, columns: 4 }        
        ]
      },
    ],
    assets: [
      { type: 'file', name: 'assets', label: 'Upload Assets', columns: 1 },
    ]
  }

  /** DEAL ******************************************************************************** */

  baseDealFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: 'ID', columns: 1 },
    { type: 'hidden', name: 'dealType', label: 'dealType', columns: 1 },
    { type: 'hidden', name: 'dealTypeName', label: 'DealType', columns: 1 },    
    { type: 'text', name: 'dealName', label: 'Deal Name', required: true, columns: 2, },
    {
      type: 'select', name: 'dealStage', label: 'Deal Stage', required: true, columns: 2,
      options: [
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Proposal', value: 'Proposal' },
        { label: 'Negotiation', value: 'Negotiation' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
      ],
    },
    { type: 'number', name: 'dealValue', label: 'Deal Value (EURO)', required: true, columns: 2, },
    { type: 'select', name: 'paymentMethod', label: 'Payment Method', listName: 'Payment Method', required: false, columns: 2, },
    { type: 'select', name: 'paymentType', label: 'Payment Type', listName: 'Payment Type', required: false, columns: 2, },
    {
      type: 'select',
      name: 'numberOfInstallements',
      label: 'Number Of Installements',
      required: false,
      dependsOn: {
        fieldName: 'paymentType',
        updateOptions: (paymentTypeValue: string) => {

          if (paymentTypeValue.toLowerCase() !== 'installments') {
            return of([]);
          }

          const options = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n: number) => ({
            label: `${n}`,
            value: `${n}`
          }));

          return of(options);
        }
      },
      columns: 2,
    },
    {
      type: 'select',
      name: 'installementFrequency',
      label: 'Installement Frequency',
      required: false,
      dependsOn: {
        fieldName: 'paymentType',
        updateOptions: (paymentTypeValue: string) => {

          if (paymentTypeValue.toLowerCase() !== 'installments') {
            return of([]);
          }

          const options = ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Bi-annual'].map((n: string) => ({
            label: `${n}`,
            value: `${n.toLowerCase()}`
          }));

          return of(options);
        }
      },
      columns: 2,
    },
    { type: 'date', name: 'closeDate', label: 'Close Date', required: false, columns: 2, },
    {
      type: 'radio', name: 'revenueOrCost', label: 'Revenue or Cost', required: true, columns: 2,
      options: [
        { label: 'Revenue', value: 'revenue' },
        { label: 'Cost', value: 'cost' },
      ],
      defaultValue: 'revenue',
      className: '!flex flex-row'
    },
  ];

  dealTypeFields: { [dealTypeId: string]: FormFieldConfig[] } = {
    "1": [ // New Business refers to a first-time sale to a brand new customer — typically the result of converting a lead or prospect into a paying client.
      { type: 'text', name: 'budgetApproval', label: 'Budget Approval Ref', required: false, columns: 2 },
      {
        type: 'select', name: 'leadSource', label: 'Lead Source', required: true, options: [
          { label: 'Website', value: 'website' },
          { label: 'Referral', value: 'referral' },
          { label: 'Trade Show', value: 'trade_show' },
          { label: 'Cold Outreach', value: 'cold_outreach' },
        ], columns: 2,
      },
    ],
    "2": [ // Renewal
      { type: 'date', name: 'currentContractEndDate', label: 'Current Contract End', required: true, columns: 2 },
      {
        type: 'select', name: 'renewalTerm', label: 'Renewal Term', required: true, options: [
          { label: '1 year', value: '1' },
          { label: '2 years', value: '2' },
          { label: '3 years', value: '3' },
        ], columns: 2,
      },
    ],
    "3": [ // Upsell Upselling is the process of recommending a more expensive or higher-end item or service when a customer is making a purchase.
      { type: 'text', name: 'existingProduct', label: 'Existing Product', required: true, columns: 2 },
      { type: 'text', name: 'upsellProduct', label: 'Upsell Product', required: true, columns: 2 },
      { type: 'number', name: 'additionalValue', label: 'Additional Value (€)', required: true, validators: { min: 0 }, columns: 2 },
    ],
    "4": [ // Cross-sell the practice of marketing additional products to existing customers
      { type: 'text', name: 'baseProduct', label: 'Base Product', required: true, columns: 2 },
      { type: 'text', name: 'crossSellProduct', label: 'Cross-sell Product', required: true, columns: 2 },
    ],
    "5": [ // Expansion Broadening the scope of an existing engagement—adding seats, modules, geographies, or business units beyond the original deal
      { type: 'textarea', name: 'currentScope', label: 'Current Scope', required: false, placeholder: 'Describe current services', columns: 2 },
      { type: 'textarea', name: 'newScopeDetails', label: 'New Scope Details', required: true, placeholder: 'Describe expansion details', columns: 2 },
    ],
    "6": [ // Pilot / Proof of Concept A limited, time-boxed trial of your solution to prove fit and ROI before committing to a full contract. Often used with large or risk-averse customers.
      { type: 'range-picker', name: 'duration', label: 'Trial Duration', required: true, columns: 2 },
      { type: 'chips', name: 'successCriteria', label: 'Success Criteria', required: true, columns: 2 },
    ],
    "7": [ // Subscription
      { type: 'select', name: 'subscriptionPlan', label: 'Plan Type', required: true, options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Annual', value: 'annual' }
      ], columns: 2 },
      { type: 'number', name: 'seats', label: 'Number of Seats', required: true, validators: { min: 1 }, columns: 2 },
    ],
    "8": [ // License Granting legal rights to use your software or technology, either perpetually or for a defined term, often with seat-based or usage-based pricing.
      {
        type: 'select', name: 'licenseType', label: 'License Type', required: true, options: [
          { label: 'Perpetual', value: 'perpetual' },
          { label: 'Term', value: 'term' },
        ], columns: 2,
      },
    ],
    "9": [ // Maintenance / Support
      {
        type: 'select', name: 'supportLevel', label: 'Support Level', required: true, options: [
          { label: 'Basic', value: 'basic' },
          { label: 'Standard', value: 'standard' },
          { label: 'Premium', value: 'premium' },
        ], columns: 2,
      },
    ],
    "10": [ // Implementation Professional services to deploy, configure, and integrate your solution into the customer’s environment—often a one-time project fee.
      { type: 'select', name: 'projectManager', label: 'Project Manager', required: true, options: [], columns: 2 },
    ],
    "11": [ // Integration Technical work to connect your product with the customer’s other systems (ERP, CRM, databases), ensuring data flows and interoperability.
      { type: 'textarea', name: 'systemsToIntegrate', label: 'Systems to Integrate', placeholder: 'Comma-separate systems', required: true, columns: 2 },
      { type: 'date', name: 'integrationDeadline', label: 'Deadline', required: false, columns: 2 },
    ],
    "12": [ // Consulting Engagement
      { type: 'textarea', name: 'consultingScope', label: 'Scope of Work', required: true, columns: 2 },
      { type: 'number', name: 'consultingHours', label: 'Estimated Hours', required: true, validators: { min: 1 }, columns: 2 },
      { type: 'select', name: 'consultantAssignee', label: 'Consultant', required: true, options: [], columns: 1 },
    ],
    "13": [ // Retainer
      // Ongoing monthly/quarterly payments for reserved services or hours, often used in consulting or creative work.
      { type: 'number', name: 'retainerAmount', label: 'Monthly Retainer (€)', required: true, validators: { min: 0 }, columns: 2 },
      { type: 'select', name: 'billingFrequency', label: 'Billing Frequency', required: true, options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
      ], columns: 2 },
    ],
  
    "14": [ // Equipment Purchase
      // Purchase of physical hardware or devices, either for internal use or resale.
      { type: 'text', name: 'equipmentName', label: 'Equipment Name', required: true, columns: 2 },
      { type: 'number', name: 'equipmentCost', label: 'Total Cost (€)', required: true, validators: { min: 0 }, columns: 2 },
    ],
  
    "15": [ // Channel Sale
      // Sale through intermediaries like distributors or resellers. Tracks the partner and their type.
      { type: 'text', name: 'channelPartner', label: 'Channel Partner Name', required: true, columns: 2 },
      { type: 'select', name: 'resellerType', label: 'Reseller Type', required: false, options: [
        { label: 'Distributor', value: 'distributor' },
        { label: 'VAR', value: 'var' },
        { label: 'OEM', value: 'oem' },
      ], columns: 2 },
    ],
  
    "16": [ // Referral
      // A deal sourced via an external referral. May involve referral fees or partner tracking.
      { type: 'text', name: 'referralSource', label: 'Referral Source', required: true, columns: 2 },
      { type: 'number', name: 'referralFee', label: 'Referral Fee (€)', required: false, columns: 2 },
    ],
  
    "17": [ // Joint Venture
      // A co-owned, jointly operated initiative between two or more businesses. Track the partner and scope.
      { type: 'textarea', name: 'venturePurpose', label: 'Purpose / Scope', required: true, columns: 2 },
      { type: 'text', name: 'partnerName', label: 'Partner Organization', required: true, columns: 2 },
    ],
  
    "18": [ // Strategic Alliance
      // Formal collaboration to align goals, share resources, or jointly go to market.
      { type: 'text', name: 'allianceGoal', label: 'Alliance Objective', required: true, columns: 2 },
      { type: 'date', name: 'startDate', label: 'Start Date', required: false, columns: 2 },
    ],
  
    "19": [ // Procurement
      // Internal or operational purchase from a vendor or supplier. Typically an expense.
      { type: 'text', name: 'itemProcured', label: 'Item / Service Procured', required: true, columns: 2 },
      { type: 'number', name: 'procurementCost', label: 'Cost (€)', required: true, validators: { min: 0 }, columns: 2 },
    ],
  
    "20": [ // Co-Marketing
      // Joint marketing campaigns with partners or affiliates, often cost-shared.
      { type: 'textarea', name: 'campaignDetails', label: 'Campaign Description', required: true, columns: 2 },
      { type: 'number', name: 'sharedBudget', label: 'Shared Budget (€)', required: false, columns: 2 },
    ],
  
    "21": [ // Co-Development
      // Collaboration on product development or innovation with another entity.
      { type: 'textarea', name: 'devScope', label: 'Development Scope', required: true, columns: 2 },
      { type: 'text', name: 'techStack', label: 'Technologies Used', required: false, columns: 2 },
    ],
  
    "22": [ // Public Sector Contract
      // Deals awarded by government bodies, may require tracking formal documentation and award dates.
      { type: 'text', name: 'contractRef', label: 'Contract Reference', required: true, columns: 2 },
      { type: 'date', name: 'contractAwardDate', label: 'Award Date', required: false, columns: 2 },
    ],
  
    "23": [ // Internal Project
      // Projects for internal organizational improvement, not customer-facing but may incur costs.
      { type: 'text', name: 'projectTitle', label: 'Project Title', required: true, columns: 2 },
      { type: 'textarea', name: 'objectives', label: 'Project Objectives', required: false, columns: 2 },
    ],
  
    "24": [ // Franchise Agreement
      // Legal and financial agreements between franchisors and franchisees. Can involve revenue and royalties.
      { type: 'select', name: 'franchiseType', label: 'Type', required: true, options: [
        { label: 'Franchisee', value: 'franchisee' },
        { label: 'Franchisor', value: 'franchisor' },
      ], columns: 2 },
      { 
        type: 'number', 
        name: 'royaltyFee', 
        label: 'Royalty Fee (%)', 
        required: false, 
        validators: { min: 0, max: 100 }, columns: 2 
      },
    ],
  
    "25": [ // Affiliate Program
      // Performance-based partnerships where commissions are paid on leads or sales.
      { type: 'text', name: 'affiliateName', label: 'Affiliate Name', required: true, columns: 2 },
      { type: 'number', name: 'commissionRate', label: 'Commission (%)', required: true, validators: { min: 0, max: 100 }, columns: 2 },
    ],
  
    "26": [ // Capital Investment
      // External funding into the business (income) or your investment into another company (expense).
      { type: 'number', name: 'investmentAmount', label: 'Investment Amount (€)', required: true, validators: { min: 0 }, columns: 2 },
      { type: 'text', name: 'investmentPurpose', label: 'Purpose', required: false, columns: 2 },
    ]
  };

  getDealTypeFields(dealTypeId: string): FormFieldConfig[] {
    return [...this.baseDealFields, ...this.dealTypeFields[dealTypeId], this.dateAndNoteMultiRowField];
  }

  // "14": [ // Equipment Purchase
  //   { type: 'multi-row', name: 'equipmentItems', label: 'Equipment Items', addRow: 'Add Item', columns: 2, fields: [
  //       { type: 'text',   name: 'itemName',     label: 'Item Name',    required: true },
  //       { type: 'number', name: 'quantity',     label: 'Quantity',     required: true, validators: { min: 1 } },
  //       { type: 'date',   name: 'deliveryDate', label: 'Delivery Date', required: false },
  //   ]},
  //   { type: 'slide-toggle', name: 'installationRequired', label: 'Installation Required?', required: false, columns: 1 },
  // ],
  // "16": [ // Referral
  //   { type: 'select', name: 'referringPartner',   label: 'Referring Partner', required: true, options: [], columns: 2 },
  //   { type: 'number', name: 'referralFeePercent', label: 'Referral Fee (%)',    required: true, validators: { min: 0, max: 100 }, columns: 1 },
  // ],
  // "17": [ // Joint Venture
  //   { type: 'text', name: 'ventureName',    label: 'JV Name',       required: true, columns: 2 },
  //   { type: 'text', name: 'equitySplit',    label: 'Equity Split',  required: true, columns: 1 },
  //   { type: 'date', name: 'ventureStart',   label: 'Start Date',    required: true, columns: 2 },
  //   { type: 'date', name: 'ventureEnd',     label: 'End Date',      required: false, columns: 2 },
  // ],
  // "18": [ // Strategic Alliance
  //   { type: 'textarea', name: 'allianceObjectives', label: 'Alliance Objectives', required: true, columns: 2 },
  //   { type: 'date',     name: 'allianceDuration',   label: 'Alliance Duration',  required: true, columns: 2 },
  // ],


  /** METHODS *************************************************************************************** */

  buildEntityTableConfigColumns(entityType:string, visibleColumns?:string[]): TableColumn[] {

    let fields = [...this.employeeFields];
    if(entityType === 'company'){
      fields = [...this.companyFields];
    }
    else if(entityType === 'deal'){
      fields = [...this.baseDealFields];
      fields = fields.filter((_, i) => ![1, 6,7,8,9, 11].includes(i));
    }

    const cols: TableColumn[] = fields
      .filter(field => field.type !== 'multi-row')
      .map(field => {
        // decide column type
        let colType: TableColumn['type'] = 'text';
        switch (field.type) {
          case 'date': case 'range-picker': colType = 'date'; break;
          case 'slider': case 'slider-range': colType = 'number'; break;
          case 'slide-toggle': colType = 'boolean'; break;
          default: colType = 'text';
        }

        const col: TableColumn = {
          key: field.name,
          label: field.label,
          type: colType,
          sortable: true,
          visible: !visibleColumns ? true : visibleColumns.includes(field.name) ? true : false
        };

        // add a default date format
        if (colType === 'date') {
          col.format = 'MMM d, y';
        }

        return col;
      });

    // append a custom Actions column
    cols.push({
      key: 'actions',
      label: 'Actions',
      type: 'custom'
    });

    return cols;
  }

  /** TASKS ******************************************************************************** */


  taskBaseFields: FormFieldConfig[] = [
    { type: 'hidden', name: 'id', label: '', required: false },
    { type: 'text', name: 'subject', label: 'Subject', required: true, validators: { minLength: 3, maxLength: 100 }, columns: 1 },
    { type: 'select', name: 'priority', label: 'Priority', required: false, multiple: false, listName: 'Priority', columns: 2 },
    { type: 'date', name: 'dueDate', label: 'Due Date', required: false, columns: 2 },
    { type: 'text-editor', name: 'notes', label: 'Notes', required: false, validators: { minLength: 0, maxLength: 500 }, columns: 1 },
    { type: 'autocomplete', name: 'assignee', label: 'Assignee', required: true, dynamicOptions: this.dataService.getEmployeeOptions(), columns: 1 },
  ];

  taskTypeFields: Record<TaskTypeT, FormFieldConfig[]> = {

    call: [
      { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true, validators: { pattern: '^\\+?[0-9]{10,15}$' }, columns: 2 },
      { type: 'select', name: 'callOutcome', label: 'Call Outcome', required: false, multiple: false, listName: 'Call Outcome', columns: 2 },
    ],
    email: [
      { type: 'email', name: 'emailAddress', label: 'Email Address', required: true, validators: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }, columns: 1 },
      { type: 'text-editor', name: 'emailBody', label: 'Email Body', required: true, columns: 1 },
    ],
    meeting: [
      { type: 'text', name: 'location', label: 'Location/Link', required: false, columns: 2 },
      { type: 'number', name: 'duration', label: 'Duration (minutes)', required: false, columns: 2 },
      { type: 'text-editor', name: 'agenda', label: 'Agenda', required: false, columns: 1 },
    ],
    followUp: [
      { type: 'text', name: 'relatedLead', label: 'Related Lead/Opportunity', required: false, columns: 1 },
    ],
    proposal: [
      { type: 'text', name: 'amount', label: 'Proposal Amount', required: true, columns: 2 },
      { type: 'text', name: 'proposalLink', label: 'Proposal Link', required: false, columns: 2 },
      { type: 'date', name: 'expirationDate', label: 'Expiration Date', required: false, columns: 2 },
    ],
    onboarding: [
      { type: 'select', name: 'onboardingStep', label: 'Onboarding Step', required: false, multiple: false, listName: 'Onboarding Steps', columns: 1 },
      { type: 'date', name: 'startDate', label: 'Start Date', required: false, columns: 2 },
      { type: 'date', name: 'endDate', label: 'End Date', required: false, columns: 2 },
    ],
    supportRequest: [
      { type: 'textarea', name: 'issueDescription', label: 'Issue Description', required: true, columns: 1 }
    ],
    contractSigning: [
      { type: 'text', name: 'contractLink', label: 'Contract Link', required: true, columns: 2 },
      { type: 'select', name: 'signingStatus', label: 'Signing Status', required: true, multiple: false, listName: 'Signing Statuses', columns: 2 },
      { type: 'date', name: 'deadline', label: 'Deadline', required: false, columns: 2 },
    ],
    renewalReminder: [
      { type: 'date', name: 'renewalDate', label: 'Renewal Date', required: true, columns: 2 },
      { type: 'text', name: 'amount', label: 'Renewal Amount', required: false, columns: 2 },
    ],
    paymentFollowUp: [
      { type: 'text', name: 'invoiceNumber', label: 'Invoice Number', required: true, columns: 2 },
      { type: 'text', name: 'amountDue', label: 'Amount Due', required: true, columns: 2 },
    ],
    surveyRequest: [
      { type: 'text', name: 'surveyLink', label: 'Survey Link', required: true, columns: 2 },
      { type: 'date', name: 'sendDate', label: 'Send Date', required: true, columns: 2 },
    ],
    internalNote: [
      { type: 'text-editor', name: 'noteBody', label: 'Note', required: true, columns: 1 },
    ],
    leadQualification: [
      { type: 'select', name: 'qualificationStatus', label: 'Qualification Status', required: false, multiple: false, listName: 'Lead Qualification', columns: 1 },
    ],
    marketingTask: [
      { type: 'text', name: 'campaignName', label: 'Campaign Name', required: true, columns: 2 },
      { type: 'select', name: 'taskType', label: 'Task Type', required: true, multiple: false, listName: 'Marketing Task Type', columns: 2 },
      { type: 'date', name: 'scheduledDate', label: 'Scheduled Date', required: true, columns: 2 },
    ],
    birthdayReminder: [
      { type: 'select', name: 'occasionType', label: 'Occasion Type', required: true, multiple: false, listName: 'Occasion Type', columns: 2 },
      { type: 'date', name: 'date', label: 'Date', required: true, columns: 2 },
    ],
    productDemo: [
      { type: 'text', name: 'demoLink', label: 'Demo Link', required: false, columns: 2 },
      { type: 'date', name: 'scheduledDate', label: 'Scheduled Date', required: true, columns: 2 },
    ],
    accountReview: [
      { type: 'date', name: 'reviewDate', label: 'Review Date', required: true, columns: 2 },
      { type: 'text', name: 'assignedRep', label: 'Assigned Representative', required: false, columns: 2 },
    ],
    trainingSession: [
      { type: 'text', name: 'trainingTopic', label: 'Training Topic', required: true, columns: 2 },
      { type: 'text', name: 'trainer', label: 'Trainer', required: false, columns: 2 },
      { type: 'date', name: 'trainingDate', label: 'Training Date', required: true, columns: 2 },
    ],
  };

  getTaskFields(taskType: TaskTypeT): FormFieldConfig[] {
    return [...this.taskBaseFields, ...this.taskTypeFields[taskType]];
  }

  // outputFormConfig: FormConfig = {
  //   title: 'Form Builder Preview',
  //   className: 'bg-gray-300 text-gray-100 p-4 rounded-lg shadow-md',
  //   fields: [],
  //   submitText: 'Test Form',
  // };


}
