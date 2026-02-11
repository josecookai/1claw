export type Policy = 'BEST' | 'CHEAP' | 'CN_OK';

export type PlanId = 'starter_20' | 'pro_40' | 'max_200';

export type InstanceStatus = 'PROVISIONING' | 'RUNNING' | 'STOPPED' | 'ERROR';

export const PLANS: { id: PlanId; price: string; label: string }[] = [
  { id: 'starter_20', price: '$20', label: 'Starter' },
  { id: 'pro_40', price: '$40', label: 'Pro' },
  { id: 'max_200', price: '$200', label: 'Max' },
];

export const POLICIES: { id: Policy; label: string; hint: string }[] = [
  { id: 'BEST', label: '最强', hint: '优先最佳模型' },
  { id: 'CHEAP', label: '省钱', hint: '优先高性价比' },
  { id: 'CN_OK', label: '国内可用', hint: '优先国内部署' },
];
