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

  dealTypes: { id: string; label: string; value: string; icon: string, relations:string[] }[] = [
    {
      id: "1",
      label: "New Business",
      value: "newBusiness",
      icon: "business",
      relations: ["Lead", "Prospect", "Customer"]
    },
    {
      id: "2",
      label: "Renewal",
      value: "renewal",
      icon: "autorenew",
      relations: ["Customer", "Reseller", "Distributor"]
    },
    {
      id: "3",
      label: "Upsell",
      value: "upsell",
      icon: "trending_up",
      relations: ["Customer", "Reseller"]
    },
    {
      id: "4",
      label: "Cross-sell",
      value: "crossSell",
      icon: "swap_horiz",
      relations: ["Customer", "Reseller"]
    },
    {
      id: "5",
      label: "Expansion",
      value: "expansion",
      icon: "open_in_full",
      relations: ["Customer", "Franchisee", "Franchisor"]
    },
    {
      id: "6",
      label: "Pilot / Proof of Concept",
      value: "pilotProofOfConcept",
      icon: "rocket_launch",
      relations: ["Prospect", "Lead"]
    },
    {
      id: "7",
      label: "Subscription",
      value: "subscription",
      icon: "subscriptions",
      relations: ["Customer", "Nonprofit"]
    },
    {
      id: "8",
      label: "License",
      value: "license",
      icon: "verified_user",
      relations: ["Customer", "Reseller", "Government", "Franchisee"]
    },
    {
      id: "9",
      label: "Maintenance / Support",
      value: "maintenanceSupport",
      icon: "build_circle",
      relations: ["Customer", "Vendor", "Franchisee", "Internal"]
    },
    {
      id: "10",
      label: "Implementation",
      value: "implementation",
      icon: "settings",
      relations: ["Customer", "Integrator", "Government", "Internal"]
    },
    {
      id: "11",
      label: "Integration",
      value: "integration",
      icon: "settings_ethernet",
      relations: ["Integrator", "Customer", "Partner"]
    },
    {
      id: "12",
      label: "Consulting Engagement",
      value: "consultingEngagement",
      icon: "support_agent",
      relations: ["Consultant", "Customer", "Agency"]
    },
    {
      id: "13",
      label: "Retainer",
      value: "retainer",
      icon: "attach_money",
      relations: ["Consultant", "Agency"]
    },
    {
      id: "14",
      label: "Equipment Purchase",
      value: "equipmentPurchase",
      icon: "shopping_cart",
      relations: ["Supplier", "Vendor"]
    },
    {
      id: "15",
      label: "Channel Sale",
      value: "channelSale",
      icon: "share",
      relations: ["Distributor", "Reseller"]
    },
    {
      id: "16",
      label: "Referral",
      value: "referral",
      icon: "group",
      relations: ["Affiliate", "Partner"]
    },
    {
      id: "17",
      label: "Joint Venture",
      value: "jointVenture",
      icon: "handshake",
      relations: ["Partner", "Franchisor", "Investor"]
    },
    {
      id: "18",
      label: "Strategic Alliance",
      value: "strategicAlliance",
      icon: "groups",
      relations: ["Partner", "Franchisor"]
    },
    {
      id: "19",
      label: "Procurement",
      value: "procurement",
      icon: "inventory",
      relations: ["Supplier", "Vendor", "Government"]
    },
    {
      id: "20",
      label: "Co-Marketing",
      value: "coMarketing",
      icon: "campaign",
      relations: ["Partner", "Affiliate"]
    },
    {
      id: "21",
      label: "Co-Development",
      value: "coDevelopment",
      icon: "science",
      relations: ["Partner"]
    },
    {
      id: "22",
      label: "Public Sector Contract",
      value: "publicSectorContract",
      icon: "gavel",
      relations: ["Government"]
    },
    {
      id: "23",
      label: "Internal Project",
      value: "internalProject",
      icon: "account_tree",
      relations: ["Internal"]
    },
    {
      id: "24",
      label: "Franchise Agreement",
      value: "franchiseAgreement",
      icon: "storefront",
      relations: ["Franchisee", "Franchisor"]
    },
    {
      id: "25",
      label: "Affiliate Program",
      value: "affiliateProgram",
      icon: "link",
      relations: ["Affiliate"]
    },
    {
      id: "26",
      label: "Capital Investment",
      value: "capitalInvestment",
      icon: "trending_up",
      relations: ["Investor"]
    }
  ];
  

  // customerDealTypes: { id: string; label: string; value: string; icon: string }[] = [
  //   { id: "1",  label: "New Business",          value: "newBusiness",         icon: "business" },
  //   { id: "2",  label: "Renewal",               value: "renewal",             icon: "autorenew" },
  //   { id: "3",  label: "Upsell",                value: "upsell",              icon: "trending_up" },
  //   { id: "4",  label: "Cross-sell",            value: "crossSell",           icon: "swap_horiz" },
  //   { id: "5",  label: "Expansion",             value: "expansion",           icon: "open_in_full" },
  //   { id: "6",  label: "Pilot / Proof of Concept", value: "pilotProofOfConcept", icon: "rocket_launch" },
  //   { id: "8",  label: "License",               value: "license",             icon: "verified_user" },
  //   { id: "9",  label: "Maintenance / Support", value: "maintenanceSupport",  icon: "build_circle" },
  //   { id: "10", label: "Implementation",        value: "implementation",      icon: "settings" },
  //   { id: "11", label: "Integration",           value: "integration",         icon: "settings_ethernet" },
  //   { id: "12", label: "Consulting Engagement", value: "consultingEngagement",icon: "support_agent" },
  // ];

  // partnerDealTypes: { id: string; label: string; value: string; icon: string }[] = [
  //   { id: "15", label: "Channel Sale",      value: "channelSale",       icon: "share" },
  //   { id: "16", label: "Referral",          value: "referral",          icon: "group" },
  //   { id: "17", label: "Joint Venture",     value: "jointVenture",      icon: "handshake" },
  //   { id: "18", label: "Strategic Alliance",value: "strategicAlliance", icon: "groups" },
  // ];



getDealFields(dealId:string): any{
  return this.dealTypes.find(deal => deal.id === dealId);
}


  

}
