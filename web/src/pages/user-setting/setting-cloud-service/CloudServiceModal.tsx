import { IModalManagerChildrenProps } from '@/components/modal-manager';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal/modal';
import { useTranslate } from '@/hooks/common-hooks';
import { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CloudServiceHeader } from './CloudServiceHeader';
import { useSaveCloudServiceConfig } from './hooks';

interface CloudServiceFormValues {
  aliyun_opensearch_hosts: string;
  aliyun_opensearch_username: string;
  aliyun_opensearch_password: string;
}

interface IProps extends Omit<IModalManagerChildrenProps, 'showModal'> {
  initialValues?: CloudServiceFormValues;
}

const CloudServiceModal = ({
  visible,
  hideModal,
  initialValues,
}: IProps) => {
  const form = useForm<CloudServiceFormValues>();
  const { t } = useTranslate('setting');
  const { onSave, loading } = useSaveCloudServiceConfig();
  const [saveLoading, setSaveLoading] = useState(false);

  const handleOk = useCallback(async () => {
    setSaveLoading(true);
    try {
      const values = form.getValues();
      await onSave(values);
      hideModal();
    } finally {
      setSaveLoading(false);
    }
  }, [form, hideModal, onSave]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      if (e.key === 'Enter') {
        await handleOk();
      }
    },
    [handleOk],
  );

  useEffect(() => {
    if (visible && initialValues) {
      form.reset(initialValues);
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={<CloudServiceHeader />}
      open={visible}
      onOpenChange={(open) => !open && hideModal()}
      onOk={handleOk}
      onCancel={hideModal}
      confirmLoading={saveLoading || loading}
      okText={t('save')}
      cancelText={t('cancel')}
      className="!w-[600px]"
      testId="cloud-service-modal"
      okButtonTestId="cloud-service-save"
    >
      <Form {...form}>
        <div className="space-y-4 py-4">
          <FormField
            name="aliyun_opensearch_hosts"
            rules={{ required: t('hostsRequired') || 'Hosts is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="text-sm font-medium text-text-secondary"
                  required
                >
                  {t('aliyunOpenSearchHosts') || 'Aliyun OpenSearch Hosts'}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://your-cluster.region.alicdn.com:9200"
                    onKeyDown={handleKeyDown}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="aliyun_opensearch_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-text-primary">
                  {t('username') || 'Username'}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="admin"
                    onKeyDown={handleKeyDown}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="aliyun_opensearch_password"
            rules={{ required: t('passwordRequired') || 'Password is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="text-sm font-medium text-text-secondary"
                  required
                >
                  {t('password') || 'Password'}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="********"
                    onKeyDown={handleKeyDown}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default CloudServiceModal;
