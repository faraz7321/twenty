import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { ON_DEMAND_FIELD_UNIVERSAL_IDENTIFIERS } from '@/object-record/record-field/on-demand/constants/OnDemandFieldUniversalIdentifiers';
import { FieldMetadataType } from 'twenty-shared/types';

export const isOnDemandField = (
  field: Pick<
    FieldMetadataItem,
    'universalIdentifier' | 'type' | 'isUIEditable'
  >,
) =>
  field.type === FieldMetadataType.RAW_JSON &&
  field.isUIEditable === false &&
  ON_DEMAND_FIELD_UNIVERSAL_IDENTIFIERS.has(field.universalIdentifier);
