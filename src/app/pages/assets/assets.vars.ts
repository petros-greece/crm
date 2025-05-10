import { TreeNodeI } from "../../components/tree/tree.component";

export class AssetsVars {

  assetsTree: TreeNodeI[] = [
    {
      name: 'Employees',
      isFile: false,
      children: [
        {
          name: 'Sales',
          isFile: false,
          children: [
            { name: 'dummy-assets/xlsx-sample-0.xlsx', isFile: true },
            { name: 'dummy-assets/image-sample-0.jpg', isFile: true },
            { name: 'dummy-assets/countries.json', isFile: true },
            { name: 'dummy-assets/pdf-sample-0.pdf', isFile: true },
            { name: 'dummy-assets/countries.json', isFile: true }
          ]
        },
        {
          name: 'Engineering',
          isFile: false,
          children: [
            { name: 'xlsx-sample-1.xlsx', isFile: true },
            { name: 'pdf-sample-0.pdf', isFile: true }
          ]
        },
        {
          name: 'Support',
          isFile: false,
          children: [
            { name: 'emily.clark.json', isFile: true },
            { name: 'frank.jones.json', isFile: true }
          ]
        }
      ]
    },
    {
      name: 'Customers',
      isFile: false,
      children: [
        {
          name: 'North America',
          isFile: false,
          children: [
            { name: 'Acme Corp.json', isFile: true },
            { name: 'Globex Industries.json', isFile: true }
          ]
        },
        {
          name: 'Europe',
          isFile: false,
          children: [
            { name: 'Initech GmbH.json', isFile: true },
            { name: 'Soylent Co. AG.json', isFile: true }
          ]
        }
      ]
    },
    {
      name: 'Companies',
      isFile: false,
      children: [
        {
          name: 'Acme Corp',
          isFile: false,
          children: [
            { name: 'overview.pdf', isFile: true },
            { name: 'financials.xlsx', isFile: true }
          ]
        },
        {
          name: 'Globex Industries',
          isFile: false,
          children: [
            { name: 'overview.pdf', isFile: true },
            { name: 'financials.xlsx', isFile: true }
          ]
        }
      ]
    },
    {
      name: 'Campaigns',
      isFile: false,
      children: [
        {
          name: 'Summer 2025',
          isFile: false,
          children: [
            { name: 'assets.zip', isFile: true },
            { name: 'report.pdf', isFile: true }
          ]
        },
        {
          name: 'Holiday 2024',
          isFile: false,
          children: [
            { name: 'assets.zip', isFile: true },
            { name: 'report.pdf', isFile: true }
          ]
        }
      ]
    },
    {
      name: 'Billing',
      isFile: false,
      children: [
        {
          name: 'Invoices',
          isFile: false,
          children: [
            { name: 'INV-1001.pdf', isFile: true },
            { name: 'INV-1002.pdf', isFile: true }
          ]
        },
        {
          name: 'Payments',
          isFile: false,
          children: [
            { name: 'PAY-2001.json', isFile: true },
            { name: 'PAY-2002.json', isFile: true }
          ]
        }
      ]
    },
    {
      name: 'Opportunities',
      isFile: false,
      children: [
        { name: 'Q3 Renewal (Closed Won)', isFile: true },
        { name: 'New Feature Pitch (Open)', isFile: true }
      ]
    },
    {
      name: 'Cases',
      isFile: false,
      children: [
        {
          name: 'Open',
          isFile: false,
          children: [
            { name: 'Ticket-1234.json', isFile: true },
            { name: 'Ticket-5678.json', isFile: true }
          ]
        },
        {
          name: 'Closed',
          isFile: false,
          children: [
            { name: 'Ticket-4321.json', isFile: true }
          ]
        }
      ]
    },
    {
      name: 'Reports',
      isFile: false,
      children: [
        { name: 'Monthly Sales.pdf', isFile: true },
        { name: 'Quarterly Review.pptx', isFile: true }
      ]
    },
    {
      name: 'Settings',
      isFile: false,
      children: [
        { name: 'permissions.json', isFile: true },
        { name: 'preferences.json', isFile: true }
      ]
    }
  ];

}