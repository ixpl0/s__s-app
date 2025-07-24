import type { Currency, BalanceSource } from '$lib/types/balance';

export const currencyOptions: Currency[] = [
  {
    value: 'USD',
    label: 'Доллары США',
    symbol: '$',
  },
  {
    value: 'RUB',
    label: 'Российские рубли',
    symbol: '₽',
  },
  {
    value: 'GEL',
    label: 'Грузинские лари',
    symbol: '₾',
  },
  {
    value: 'TRY',
    label: 'Турецкие лиры',
    symbol: '₺',
  },
  {
    value: 'THB',
    label: 'Тайские баты',
    symbol: '฿',
  },
  {
    value: 'INR',
    label: 'Индийские рупии',
    symbol: '₹',
  },
];

export const mockBalanceSources: BalanceSource[] = [
  {
    id: '1',
    name: 'Наличка в кошельке',
    currency: 'USD',
    amount: 500,
  },
  {
    id: '2',
    name: 'Банк TBC',
    currency: 'GEL',
    amount: 2500,
  },
  {
    id: '3',
    name: 'Сбербанк',
    currency: 'RUB',
    amount: 150000,
  },
  {
    id: '4',
    name: 'Криптовалюта',
    currency: 'USD',
    amount: 1200,
  },
];
