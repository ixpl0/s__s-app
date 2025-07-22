<script lang="ts">
  interface MonthData {
    month: number;
    year: number;
    startBalance: number;
    balanceChange: number;
    pocketExpenses: number;
    income: number;
    expenses: number;
  }

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat('ru-RU', { month: 'long' })
      .format(new Date(2000, i)));

  const monthsData: MonthData[] = [
    {
      month: 6,
      year: 2025,
      startBalance: 33781,
      balanceChange: 1576,
      pocketExpenses: 380,
      income: 6800,
      expenses: 4620,
    },
    {
      month: 5,
      year: 2025,
      startBalance: 32205,
      balanceChange: 263,
      pocketExpenses: 420,
      income: 7200,
      expenses: 4580,
    },
    {
      month: 4,
      year: 2025,
      startBalance: 31942,
      balanceChange: -654,
      pocketExpenses: 750,
      income: 5500,
      expenses: 6350,
    },
    {
      month: 3,
      year: 2025,
      startBalance: 29448,
      balanceChange: 3200,
      pocketExpenses: 280,
      income: 8500,
      expenses: 5020,
    },
    {
      month: 2,
      year: 2025,
      startBalance: 8650,
      balanceChange: 1450,
      pocketExpenses: 520,
      income: 6800,
      expenses: 4830,
    },
    {
      month: 1,
      year: 2025,
      startBalance: 7200,
      balanceChange: -890,
      pocketExpenses: 890,
      income: 4200,
      expenses: 4680,
    },
    {
      month: 0,
      year: 2025,
      startBalance: 8090,
      balanceChange: 2800,
      pocketExpenses: 350,
      income: 7800,
      expenses: 4650,
    },
    {
      month: 11,
      year: 2024,
      startBalance: 5290,
      balanceChange: 2800,
      pocketExpenses: 450,
      income: 6200,
      expenses: 2950,
    },
    {
      month: 10,
      year: 2024,
      startBalance: 2490,
      balanceChange: -1200,
      pocketExpenses: 680,
      income: 4800,
      expenses: 5320,
    },
    {
      month: 9,
      year: 2024,
      startBalance: 3690,
      balanceChange: 1800,
      pocketExpenses: 320,
      income: 5500,
      expenses: 3380,
    },
    {
      month: 8,
      year: 2024,
      startBalance: 1890,
      balanceChange: -800,
      pocketExpenses: 920,
      income: 5200,
      expenses: 4280,
    },
    {
      month: 7,
      year: 2024,
      startBalance: 2690,
      balanceChange: 3200,
      pocketExpenses: 280,
      income: 7800,
      expenses: 4320,
    },
    {
      month: 6,
      year: 2024,
      startBalance: -510,
      balanceChange: -650,
      pocketExpenses: 750,
      income: 4200,
      expenses: 4600,
    },
    {
      month: 5,
      year: 2024,
      startBalance: 140,
      balanceChange: 2100,
      pocketExpenses: 380,
      income: 6500,
      expenses: 4020,
    },
    {
      month: 4,
      year: 2024,
      startBalance: -1960,
      balanceChange: 1450,
      pocketExpenses: 520,
      income: 5800,
      expenses: 3830,
    },
  ];

  // TODO: Replace with real data fetching logic
  // eslint-disable-next-line svelte/no-immutable-reactive-statements
  $: groupedData = monthsData.reduce((acc, month) => {
    if (!acc[month.year]) {
      acc[month.year] = [];
    }

    acc[month.year].push(month);

    return acc;
  }, {} as Record<number, MonthData[]>);

  $: years = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a);

  function getBalanceChangeClass(change: number): string {
    if (change > 0) {
      return 'text-success';
    }

    if (change < 0) {
      return 'text-error';
    }

    return '';
  }

  function getPocketExpensesClass(expenses: number, income: number): string {
    const percentage = (expenses / income) * 100;

    if (percentage < 7) {
      return 'text-success';
    }

    if (percentage < 14) {
      return 'text-warning';
    }

    return 'text-error';
  }

  function toUsd(n: number): string {
    return n.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  }
</script>

<div class="min-h-screen bg-base-100">

  <ul class="timeline timeline-vertical [--timeline-col-start:15ch]">
    {#each years as year (year)}
      <li>
        <hr />
        <div class="timeline-start">
          <h2 class="text-xl font-bold">{year}</h2>
        </div>

        <div class="timeline-middle">
          <svg
            class="h-5 w-5"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </div>
        <hr />
      </li>

      {#each groupedData[year] as monthData (monthData.year + monthData.month)}
        <li>
          <hr />
          <div class="timeline-start">
            <div
              class="tooltip capitalize"
              data-tip="{monthNames[monthData.month]} {monthData.year}"
            >
              <div class="badge badge-ghost badge-lg uppercase">
                {monthNames[monthData.month]}
              </div>
            </div>
          </div>

          <div class="timeline-middle">
            <svg
              class="h-5 w-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
          </div>

          <div class="timeline-end stats shadow">
            <div class="stat place-items-center">
              <div class="stat-title">Баланс на начало месяца</div>
              <div class="stat-value text-primary">
                <div
                  class="tooltip tooltip-right font-normal"
                  data-tip="Сумма всех сбережений на начало месяца. Этого хватило бы на {Math.floor(monthData.startBalance / 3500)} мес"
                >
                  <button class="btn btn-ghost text-[2rem] font-extrabold">
                    {toUsd(monthData.startBalance)}
                  </button>
                </div>
              </div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title text-center">Изменение баланса</div>
              <div class="stat-value">
                <div
                  class="tooltip tooltip-right font-normal"
                  data-tip="Всё, что осталось после вычета крупных расходов из общих расходов. Это деньги на еду, оплату подписок, мелкие покупки и т.д."
                >
                  <button class="btn btn-ghost text-[2rem] font-extrabold {getBalanceChangeClass(monthData.balanceChange)}" disabled>
                    {toUsd(monthData.balanceChange)}
                  </button>
                </div>
              </div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title">Доходы</div>
              <div class="stat-value text-success">
                <div
                  class="tooltip tooltip-left font-normal"
                  data-tip="Все доходы за {monthNames[monthData.month]} {monthData.year}. Это зарплата, бонусы, подарки и т.д."
                >
                  <button class="btn btn-ghost text-[2rem] font-extrabold">
                    {toUsd(monthData.income)}
                  </button>
                </div>
              </div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title">Крупные расходы</div>
              <div class="stat-value text-error">
                <div
                  class="tooltip tooltip-left font-normal"
                  data-tip="Все крупные расходы за {monthNames[monthData.month]} {monthData.year}. Это оплата квартиры, покупка техники, путешествия и т.д."
                >
                  <button class="btn btn-ghost text-[2rem] font-extrabold">
                    {toUsd(monthData.expenses)}
                  </button>
                </div>
              </div>
            </div>


            <div class="stat place-items-center">
              <div class="stat-title text-center">Карманные расходы</div>
              <div class="stat-value">
                <div
                  class="tooltip tooltip-left font-normal"
                  data-tip="Всё, что осталось после вычета крупных расходов из общих расходов. Это деньги на еду, оплату подписок, мелкие покупки и т.д."
                >
                  <button class="btn btn-ghost text-[2rem] font-extrabold {getPocketExpensesClass(monthData.pocketExpenses, monthData.income)}" disabled>
                    {toUsd(monthData.pocketExpenses)}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </li>
      {/each}
    {/each}
  </ul>
</div>
