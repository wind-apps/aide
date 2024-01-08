import Emittery from 'emittery'
import type { ItemsRecord } from '@main/db/generated'

export interface Events {
  'create': ItemsRecord
  'update': ItemsRecord
  'delete': ItemsRecord
}

export default new Emittery<Events>()
