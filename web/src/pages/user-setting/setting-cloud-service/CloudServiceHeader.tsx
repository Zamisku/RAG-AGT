import { useTranslate } from '@/hooks/common-hooks';

export function CloudServiceHeader() {
  const { t } = useTranslate('setting');

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-medium">
        {t('cloudServiceConfig') || 'Cloud Service Configuration'}
      </span>
    </div>
  );
}
