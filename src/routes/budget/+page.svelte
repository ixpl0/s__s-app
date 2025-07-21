<script lang="ts">
  interface MonthData {
    month: string;
    year: number;
    startBalance: number;
    balanceChange: number;
    pocketExpenses: number;
    income: number;
    expenses: number;
  }

  const monthsData: MonthData[] = [
    {
      month: 'Июль',
      year: 2025,
      startBalance: 15200,
      balanceChange: 1800,
      pocketExpenses: 380,
      income: 6800,
      expenses: 4620,
    },
    {
      month: 'Июнь',
      year: 2025,
      startBalance: 13400,
      balanceChange: 2200,
      pocketExpenses: 420,
      income: 7200,
      expenses: 4580,
    },
    {
      month: 'Май',
      year: 2025,
      startBalance: 11200,
      balanceChange: -650,
      pocketExpenses: 750,
      income: 5500,
      expenses: 6350,
    },
    {
      month: 'Апрель',
      year: 2025,
      startBalance: 11850,
      balanceChange: 3200,
      pocketExpenses: 280,
      income: 8500,
      expenses: 5020,
    },
    {
      month: 'Март',
      year: 2025,
      startBalance: 8650,
      balanceChange: 1450,
      pocketExpenses: 520,
      income: 6800,
      expenses: 4830,
    },
    {
      month: 'Февраль',
      year: 2025,
      startBalance: 7200,
      balanceChange: -890,
      pocketExpenses: 890,
      income: 4200,
      expenses: 4680,
    },
    {
      month: 'Январь',
      year: 2025,
      startBalance: 8090,
      balanceChange: 2800,
      pocketExpenses: 350,
      income: 7800,
      expenses: 4650,
    },
    {
      month: 'Декабрь',
      year: 2024,
      startBalance: 5290,
      balanceChange: 2800,
      pocketExpenses: 450,
      income: 6200,
      expenses: 2950,
    },
    {
      month: 'Ноябрь',
      year: 2024,
      startBalance: 2490,
      balanceChange: -1200,
      pocketExpenses: 680,
      income: 4800,
      expenses: 5320,
    },
    {
      month: 'Октябрь',
      year: 2024,
      startBalance: 3690,
      balanceChange: 1800,
      pocketExpenses: 320,
      income: 5500,
      expenses: 3380,
    },
    {
      month: 'Сентябрь',
      year: 2024,
      startBalance: 1890,
      balanceChange: -800,
      pocketExpenses: 920,
      income: 5200,
      expenses: 4280,
    },
    {
      month: 'Август',
      year: 2024,
      startBalance: 2690,
      balanceChange: 3200,
      pocketExpenses: 280,
      income: 7800,
      expenses: 4320,
    },
    {
      month: 'Июль',
      year: 2024,
      startBalance: -510,
      balanceChange: -650,
      pocketExpenses: 750,
      income: 4200,
      expenses: 4600,
    },
    {
      month: 'Июнь',
      year: 2024,
      startBalance: 140,
      balanceChange: 2100,
      pocketExpenses: 380,
      income: 6500,
      expenses: 4020,
    },
    {
      month: 'Май',
      year: 2024,
      startBalance: -1960,
      balanceChange: 1450,
      pocketExpenses: 520,
      income: 5800,
      expenses: 3830,
    },
  ];

  // Группируем данные по годам
  $: groupedData = monthsData.reduce((acc, month) => {
    if (!acc[month.year]) {
      acc[month.year] = [];
    }

    acc[month.year].push(month);

    return acc;
  }, {} as Record<number, MonthData[]>);

  // Получаем отсортированные годы (от новых к старым)
  $: years = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a);

  function formatCurrency(amount: number): string {
    return `$${amount.toFixed(0)}`;
  }

  function getBalanceChangeClass(change: number): string {
    if (change > 0) {
      return 'bg-success text-success-content';
    }

    if (change < 0) {
      return 'bg-error text-error-content';
    }

    return '';
  }

  function getPocketExpensesClass(expenses: number, income: number): string {
    const percentage = (expenses / income) * 100;

    if (percentage < 15) {
      return 'bg-success text-success-content';
    }

    if (percentage < 25) {
      return 'bg-warning text-warning-content';
    }

    return 'bg-error text-error-content';
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="sticky top-0 z-10 bg-base-200 shadow-md">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-6 gap-4 py-4 text-sm font-semibold text-base-content">
        <div class="text-center">Месяц</div>
        <div class="text-center">Баланс на начало</div>
        <div class="text-center">Изменение баланса</div>
        <div class="text-center">Карманные расходы</div>
        <div class="text-center">Доходы</div>
        <div class="text-center">Расходы</div>
      </div>
    </div>
  </div>

  <!-- Контент с карточками месяцев -->
  <div class="container mx-auto px-4 py-4">
    {#each years as year (year)}
      <!-- Sticky год -->
      <div class="sticky top-16 z-20 bg-primary text-primary-content shadow-lg mb-4">
        <div class="py-3 px-4">
          <h2 class="text-xl font-bold">Бюджет {year}</h2>
        </div>
      </div>

      <!-- Месяцы этого года -->
      {#each groupedData[year] as monthData (monthData.year + monthData.month)}
        <div class="card bg-base-100 shadow-sm mb-2 hover:shadow-md transition-shadow">
          <div class="card-body p-4">
            <div class="grid grid-cols-6 gap-4 items-center">
              <!-- Месяц -->
              <div class="text-center">
                <div
                  class="tooltip"
                  data-tip="{monthData.month} {monthData.year}"
                >
                  <div class="badge badge-outline badge-lg">
                    {monthData.month.substring(0, 3)}
                  </div>
                </div>
              </div>

              <!-- Баланс на начало месяца -->
              <div class="text-center">
                <button class="btn btn-ghost btn-sm hover:btn-primary">
                  {formatCurrency(monthData.startBalance)}
                </button>
              </div>

              <!-- Изменение баланса -->
              <div class="text-center">
                <div class="badge {getBalanceChangeClass(monthData.balanceChange)} badge-lg">
                  {monthData.balanceChange > 0 ? '+' : ''}{formatCurrency(monthData.balanceChange)}
                </div>
              </div>

              <!-- Карманные расходы -->
              <div class="text-center">
                <div class="badge {getPocketExpensesClass(monthData.pocketExpenses, monthData.income)} badge-lg">
                  {formatCurrency(monthData.pocketExpenses)}
                </div>
              </div>

              <!-- Доходы -->
              <div class="text-center">
                <button class="btn btn-ghost btn-sm hover:btn-success text-success">
                  {formatCurrency(monthData.income)}
                </button>
              </div>

              <!-- Расходы -->
              <div class="text-center">
                <button class="btn btn-ghost btn-sm hover:btn-error text-error">
                  {formatCurrency(monthData.expenses)}
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/each}
  </div>
</div>
