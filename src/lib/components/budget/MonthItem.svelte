<script lang="ts">
  import type { MonthData } from '$lib/types/budget';
  import {
    getBalanceChangeClass,
    getPocketExpensesClass,
    toUsd,
  } from '$lib/utils/budget';
  import BalanceModal from './BalanceModal.svelte';
  import { userMonthService } from '$lib/services/user-month-service';

  export let monthData: MonthData;
  export let monthNames: string[];
  export let exchangeRates: Record<string, Record<string, number>>;

  let isBalanceModalOpen = false;

  $: currentMonthRates = (() => {
    const rateDate = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-01`;

    return (exchangeRates && exchangeRates[rateDate]) || {};
  })();

  async function openBalanceModal(): Promise<void> {
    if (!monthData.userMonthId || monthData.userMonthId.trim() === '') {
      const response = await userMonthService.createUserMonth({
        year: monthData.year,
        month: monthData.month,
      });

      if (response.success && response.data) {
        monthData.userMonthId = response.data.userMonth.id;
      } else {
        return;
      }
    }

    isBalanceModalOpen = true;
  }
</script>

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
    <svg class="h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
          data-tip="Сумма всех сбережений на начало месяца. Этого хватило бы на {Math.floor(
            monthData.startBalance / 3500,
          )} мес"
        >
          <button
            class="btn btn-ghost text-[2rem] font-extrabold"
            on:click={openBalanceModal}
          >
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
          <button
            class="btn btn-ghost text-[2rem] font-extrabold {getBalanceChangeClass(
              monthData.balanceChange,
            )}"
            disabled
          >
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
          data-tip="Все доходы за {monthNames[
            monthData.month
          ]} {monthData.year}. Это зарплата, бонусы, подарки и т.д."
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
          data-tip="Все крупные расходы за {monthNames[
            monthData.month
          ]} {monthData.year}. ��то оплата квартиры, покупка техники, путешествия и т.д."
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
          <button
            class="btn btn-ghost text-[2rem] font-extrabold {getPocketExpensesClass(
              monthData.pocketExpenses,
              monthData.income,
            )}"
            disabled
          >
            {toUsd(monthData.pocketExpenses)}
          </button>
        </div>
      </div>
    </div>
  </div>
  <hr />
</li>

{#if isBalanceModalOpen}
  <BalanceModal
    bind:isOpen={isBalanceModalOpen}
    exchangeRates={currentMonthRates}
    month={monthData.month}
    monthName={monthNames[monthData.month]}
    userMonthId={monthData.userMonthId}
    year={monthData.year}
  />
{/if}
