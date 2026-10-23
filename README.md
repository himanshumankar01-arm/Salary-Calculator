# Daily Wage Salary Calculator (React + Vite)

Calculates an employee's salary from joining date, payment date, leaves taken
and a daily wage that depends on the employee's position.

## Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## How the salary is calculated

- Total days = days from joining date to payment date (both dates included)
- Days worked = total days − leaves taken
- Salary = days worked × wage per day

## Change positions and wages

Edit the `POSITIONS` list at the top of `src/App.jsx`.
