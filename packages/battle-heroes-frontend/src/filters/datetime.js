import moment from 'moment'
import { DATETIME_FORMAT } from '@/utils/constants'

export function datetime(value) {
  return moment.unix(value).format(DATETIME_FORMAT)
}
