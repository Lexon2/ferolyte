import { SoundEvent } from '../../../server-entity/constants/sound-events';

export interface ItemRecordComponent {
  soundEvent: SoundEvent;
  comparatorSignal?: number;
  duration?: number;
}
