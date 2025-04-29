import { TreeNodeI } from "../../components/tree/tree.component";

export class AssetsVars {

  assetsTree: TreeNodeI[] = [
    {

      name: 'Employees',
      children: [
        {
          name: 'Sales', children: [
            { name: 'dummy-assets/xlsx-sample-0.xlsx' },
            { name: 'dummy-assets/image-sample-0.jpg' },
            { name: 'dummy-assets/countries.json' },
            { name: 'dummy-assets/pdf-sample-0.pdf' },
            { name: 'dummy-assets/countries.json' }
          ]
        },
        {
          name: 'Engineering', children: [
            { name: 'xlsx-samlpe-1.xlsx' },
            { name: 'pdf-sample-0.pdf' }
          ]
        },
        {
          name: 'Support', children: [
            { name: 'emily.clark.json' },
            { name: 'frank.jones.json' }
          ]
        }
      ]
    },
    {
      name: 'Customers',
      children: [
        {
          name: 'North America',
          children: [
            { name: 'Acme Corp.json' },
            { name: 'Globex Industries.json' }
          ]
        },
        {
          name: 'Europe',
          children: [
            { name: 'Initech GmbH.json' },
            { name: 'Soylent Co. AG.json' }
          ]
        }
      ]
    },
    {
      name: 'Companies',
      children: [
        {
          name: 'Acme Corp', children: [
            { name: 'overview.pdf' },
            { name: 'financials.xlsx' }
          ]
        },
        {
          name: 'Globex Industries', children: [
            { name: 'overview.pdf' },
            { name: 'financials.xlsx' }
          ]
        }
      ]
    },
    {
      name: 'Campaigns',
      children: [
        {
          name: 'Summer 2025', children: [
            { name: 'assets.zip' },
            { name: 'report.pdf' }
          ]
        },
        {
          name: 'Holiday 2024', children: [
            { name: 'assets.zip' },
            { name: 'report.pdf' }
          ]
        }
      ]
    },
    {
      name: 'Billing',
      children: [
        {
          name: 'Invoices', children: [
            { name: 'INV-1001.pdf' },
            { name: 'INV-1002.pdf' }
          ]
        },
        {
          name: 'Payments', children: [
            { name: 'PAY-2001.json' },
            { name: 'PAY-2002.json' }
          ]
        }
      ]
    },
    {
      name: 'Opportunities',
      children: [
        { name: 'Q3 Renewal (Closed Won)' },
        { name: 'New Feature Pitch (Open)' }
      ]
    },
    {
      name: 'Cases',
      children: [
        {
          name: 'Open', children: [
            { name: 'Ticket-1234.json' },
            { name: 'Ticket-5678.json' }
          ]
        },
        {
          name: 'Closed', children: [
            { name: 'Ticket-4321.json' }
          ]
        }
      ]
    },
    {
      name: 'Reports',
      children: [
        { name: 'Monthly Sales.pdf' },
        { name: 'Quarterly Review.pptx' }
      ]
    },
    {
      name: 'Settings',
      children: [
        { name: 'permissions.json' },
        { name: 'preferences.json' }
      ]
    }
  ]

}

