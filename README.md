# Home Ledger

A household finance tracker built as a static web app. No server required — all data lives in your browser's localStorage.

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Monthly dashboard — income, spending, net, debt snapshot |
| `transactions.html` | Log expenses & income, filter, edit, attach receipt photos |
| `budget.html` | Set monthly category budgets, track actual vs target |
| `debts.html` | Track all 10 debt accounts, snowball/avalanche payoff calculator |
| `recurring.html` | Bills & subscriptions, due date alerts, quick-log payments |

## Hosting on GitHub Pages

1. Create a new GitHub repository (can be private)
2. Upload all files maintaining this folder structure:
   ```
   finance-ledger/
   ├── index.html
   ├── transactions.html
   ├── budget.html
   ├── debts.html
   ├── recurring.html
   ├── css/
   │   └── style.css
   └── js/
       └── data.js
   ```
3. Go to repo Settings → Pages → Source: Deploy from branch → main → / (root)
4. Your site will be live at `https://yourusername.github.io/repo-name`

## Data & Privacy

- All data is stored in **your browser's localStorage** — nothing goes to any server
- Use **Export backup** regularly to save a `.json` file
- To move data to another device: Export on old device, Import on new device
- Receipt photos are stored as base64 in localStorage — keep backups if you use this feature heavily

## Spending Categories

Credit Cards · Fast Food · Fuel · Auction (purchases) · Grocery · EBT · Automotive · Tools · Farm · Insurance · Fees · Business · Bills · Interest · Phones · Misc

## Income Sources

eBay Sales · General Sales · Job/Paycheck · 4 Dry Out · Notion by Nature · Misc Income · Other

## Future: Bank API sync

The data layer (`js/data.js`) is designed so all reads/writes go through one place. When ready to connect bank accounts via Plaid or similar, only `data.js` needs to change — the UI pages stay the same.
