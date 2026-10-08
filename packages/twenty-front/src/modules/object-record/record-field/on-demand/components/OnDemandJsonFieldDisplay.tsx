import { OnDemandJsonFieldViewer } from '@/object-record/record-field/on-demand/components/OnDemandJsonFieldViewer';
import { useOnDemandFieldDisplay } from '@/object-record/record-field/on-demand/hooks/useOnDemandFieldDisplay';
import { t } from '@lingui/core/macro';
import { useRef } from 'react';
import { Button } from 'twenty-ui/primitives/input';

export const OnDemandJsonFieldDisplay = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { loadStatus, openOnDemandField, closeOnDemandField } =
    useOnDemandFieldDisplay();

  return (
    <>
      <Button
        ref={anchorRef}
        variant="ghost"
        size="sm"
        aria-haspopup="dialog"
        aria-expanded={loadStatus !== 'closed'}
        aria-busy={loadStatus === 'loading'}
        onClick={(event) => {
          event.stopPropagation();
          void openOnDemandField();
        }}
        onKeyDown={(event) => {
          event.stopPropagation();

          if (event.key === 'Escape' && loadStatus !== 'closed') {
            event.preventDefault();
            closeOnDemandField();
          }
        }}
      >
        {t`View value`}
      </Button>
      {loadStatus !== 'closed' && (
        <OnDemandJsonFieldViewer
          anchorElement={anchorRef.current ?? undefined}
          loadStatus={loadStatus}
          onClose={closeOnDemandField}
          onRetry={() => void openOnDemandField()}
        />
      )}
    </>
  );
};
