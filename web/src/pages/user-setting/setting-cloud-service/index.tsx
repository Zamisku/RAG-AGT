import Spotlight from '@/components/spotlight';
import { useFetchTenantInfo } from '@/hooks/use-user-setting-request';
import CloudServiceSection from './CloudServiceSection';

const CloudServiceSettings = () => {
  const { data: tenantInfo } = useFetchTenantInfo();

  // Extract cloud service config from tenant info if available
  const cloudServiceConfig = tenantInfo?.aliyun_opensearch;

  return (
    <div className="flex w-full border-[0.5px] border-border-button rounded-lg relative">
      <Spotlight />
      <section className="flex flex-col gap-4 w-full px-5 py-5 overflow-auto scrollbar-auto">
        <CloudServiceSection
          initialConfig={{
            aliyun_opensearch_hosts: cloudServiceConfig?.hosts,
            aliyun_opensearch_username: cloudServiceConfig?.username,
          }}
        />
      </section>
    </div>
  );
};

export default CloudServiceSettings;
