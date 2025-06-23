/**
 * Get the status and statusCopy based on the approval state and whether it's my vacations.
 * @param canIApproveIt
 * @param aprobadas
 * @param isMyVacations
 * @returns
 */
export function getApprovalIndicator(
  canIApproveIt: boolean,
  aprobadas: boolean | null,
  isMyVacations: boolean
): string {
  if (canIApproveIt) return '🟢';
  if (aprobadas !== null || isMyVacations) return '';
  return '⚫';
}
