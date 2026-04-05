import { useSetModalState } from '@/hooks/common-hooks';
import { useFetchTenantInfo, useSaveTenantInfo } from '@/hooks/use-llm-request';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import userService from '@/services/user-service';

interface CloudServiceConfig {
  aliyun_opensearch_hosts: string;
  aliyun_opensearch_username?: string;
  aliyun_opensearch_password: string;
}

export const useSaveCloudServiceConfig = () => {
  const { data: tenantInfo } = useFetchTenantInfo();
  const { saveTenantInfo } = useSaveTenantInfo();
  const [loading, setLoading] = useState(false);

  const onSave = useCallback(
    async (config: CloudServiceConfig) => {
      if (!tenantInfo?.tenant_id) {
        console.error('Tenant info not loaded');
        return;
      }

      setLoading(true);
      try {
        // Using the set_tenant_info API
        await userService.set_tenant_info({
          tenant_id: tenantInfo.tenant_id,
          name: tenantInfo.name,
          asr_id: '',
          embd_id: '',
          img2txt_id: '',
          llm_id: '',
          // Additional fields for cloud service config
          aliyun_opensearch: {
            hosts: config.aliyun_opensearch_hosts,
            username: config.aliyun_opensearch_username || '',
            password: config.aliyun_opensearch_password,
          },
          doc_engine: 'aliyun-opensearch',
        });
      } finally {
        setLoading(false);
      }
    },
    [tenantInfo],
  );

  return {
    onSave,
    loading,
  };
};

export const useCloudServiceModal = () => {
  const {
    visible: cloudServiceVisible,
    hideModal: hideCloudServiceModal,
    showModal: showCloudServiceModal,
  } = useSetModalState();

  return {
    cloudServiceVisible,
    hideCloudServiceModal,
    showCloudServiceModal,
  };
};
