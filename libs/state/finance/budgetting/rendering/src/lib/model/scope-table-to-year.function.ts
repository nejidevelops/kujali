import { clone as ___clone } from 'lodash';

import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';
import { AmountPerYear, BudgetRow } from "@app/model/finance/planning/budget-lines";

// IAN
// import { FinancialExplorerState } from "./f-explorer.state.model";
import { NULL_AMOUNT_BY_YEAR_AND_MONTH } from '@app/model/finance/planning/budget-defaults';
import { Budget } from '@app/model/finance/planning/budgets';

/**
 * Scopes a RenderedBudget to a financial year.
 * 
 * @param state - The  to scope
 * @param year  - The year to scope too
 */
export function __ScopeStateToYear(state: any)
{
  const year = state.year;

  if(state.loaded)
  {
    // TODO (IAN) add strict types to map 
    state.scopedCosts        = state.budget.costs.map((c: any) => _scopeLine(state.budget, year, c));
    state.scopedCostTotals   = _scopeLine(state.budget, year, state.budget.costTotals);
    state.scopedIncome       = state.budget.income.map((c: any) => _scopeLine(state.budget, year, c));
    state.scopedIncomeTotals = _scopeLine(state.budget, year, state.budget.incomeTotals);
    state.scopedChildBudgets = state.budget.children.map((c: any) => _scopeLine(state.budget, year, c.header));
    state.scopedResult       = _scopeLine(state.budget, year, state.budget.result);
    state.scopedBalance      = _scopeLine(state.budget, year, state.budget.balance);
  }
  return state;
}

/** Scope a signle line */
function _scopeLine(budget: Budget, year: number, row: BudgetRow) 
{
  const line = ___clone(row) as BudgetRowYear;
  line.year = year;

  // Sometimes the budget is not initialised. This can happen when incorporating child budgets of empty budgets
  if(!row.amountsYear)
    row.amountsYear = NULL_AMOUNT_BY_YEAR_AND_MONTH(budget.startYear, budget.duration);

  const yearBudget = _findYear(year, row.amountsYear);

  if(yearBudget)
  {
    line.amountsMonth = yearBudget.amountsMonth;
    line.totalYear = yearBudget.total;
  }

  return line;
}

const _findYear = (year: number, allYears: AmountPerYear[]) => allYears.find(y => y.year === year) as AmountPerYear;