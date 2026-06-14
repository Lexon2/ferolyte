export interface ItemRepairableComponent {
  repairItems: Array<{
    items: string[];
    repairAmount: number | string;
  }>
}
