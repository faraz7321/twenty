import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { isDefined } from 'twenty-shared/utils';

type RecordVersion = Partial<
  Pick<
    ObjectRecord & { updatedAt: string; deletedAt: string | null },
    'id' | 'updatedAt' | 'deletedAt'
  >
>;

export const isOnDemandFieldResponseStale = ({
  recordAtRequest,
  currentRecord,
  responseUpdatedAt,
}: {
  recordAtRequest: RecordVersion | null | undefined;
  currentRecord: RecordVersion | null | undefined;
  responseUpdatedAt: string | undefined;
}): boolean => {
  if (
    (isDefined(recordAtRequest) && !isDefined(currentRecord)) ||
    isDefined(currentRecord?.deletedAt)
  ) {
    return true;
  }

  if (!isDefined(responseUpdatedAt)) {
    return isDefined(recordAtRequest) || isDefined(currentRecord)
      ? recordAtRequest !== currentRecord
      : false;
  }

  const responseTimestamp = Date.parse(responseUpdatedAt);

  if (Number.isNaN(responseTimestamp)) {
    return true;
  }

  return [recordAtRequest?.updatedAt, currentRecord?.updatedAt].some(
    (updatedAt) => {
      if (!isDefined(updatedAt)) {
        return false;
      }

      const recordTimestamp = Date.parse(updatedAt);

      return (
        Number.isNaN(recordTimestamp) || recordTimestamp > responseTimestamp
      );
    },
  );
};
