import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslate } from '@/hooks/common-hooks';
import { CloudDatabase, Key, Sparkles, Waves } from 'lucide-react';
import { useCloudServiceModal, useSaveCloudServiceConfig } from './hooks';
import CloudServiceModal from './CloudServiceModal';

interface CloudServiceSectionProps {
  initialConfig?: {
    aliyun_opensearch_hosts?: string;
    aliyun_opensearch_username?: string;
  };
}

export function CloudServiceSection({ initialConfig }: CloudServiceSectionProps) {
  const { t } = useTranslate('setting');
  const { cloudServiceVisible, hideCloudServiceModal, showCloudServiceModal } =
    useCloudServiceModal();
  const { onSave, loading } = useSaveCloudServiceConfig();

  const handleConfigure = () => {
    showCloudServiceModal();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <CloudDatabase className="w-5 h-5" />
            {t('cloudService') || 'Cloud Services'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* DeepSeek Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">DeepSeek</h4>
                <p className="text-sm text-text-secondary">
                  {t('deepseekDescription') || 'LLM for chat and reasoning'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.open('https://platform.deepseek.com/api_keys', '_blank');
                }}
              >
                {t('getApiKey') || 'Get API Key'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = '/user-setting/model';
                }}
              >
                {t('configureInModelPage') || 'Configure in Model Settings'}
              </Button>
            </div>
          </div>

          {/* DashScope Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">DashScope</h4>
                <p className="text-sm text-text-secondary">
                  {t('dashscopeDescription') || 'Embedding and AI models'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.open('https://dashscope.console.aliyun.com/apiKey', '_blank');
                }}
              >
                {t('getApiKey') || 'Get API Key'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = '/user-setting/model';
                }}
              >
                {t('configureInModelPage') || 'Configure in Model Settings'}
              </Button>
            </div>
          </div>

          {/* SiliconFlow Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Waves className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">SiliconFlow</h4>
                <p className="text-sm text-text-secondary">
                  {t('siliconflowDescription') || 'Unified API for LLMs and Embeddings'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.open('https://cloud.siliconflow.cn/account/ak', '_blank');
                }}
              >
                {t('getApiKey') || 'Get API Key'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = '/user-setting/model';
                }}
              >
                {t('configureInModelPage') || 'Configure in Model Settings'}
              </Button>
            </div>
          </div>

          {/* Aliyun OpenSearch Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CloudDatabase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">
                  {t('aliyunOpenSearch') || 'Aliyun OpenSearch'}
                </h4>
                <p className="text-sm text-text-secondary">
                  {initialConfig?.aliyun_opensearch_hosts
                    ? initialConfig.aliyun_opensearch_hosts
                    : t('notConfigured') || 'Not configured'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.open('https://www.aliyun.com/product/opensearch', '_blank');
                }}
              >
                {t('getApiKey') || 'Get API Key'}
              </Button>
              <Button variant="default" size="sm" onClick={handleConfigure}>
                {initialConfig?.aliyun_opensearch_hosts
                  ? t('edit') || 'Edit'
                  : t('configure') || 'Configure'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CloudServiceModal
        visible={cloudServiceVisible}
        hideModal={hideCloudServiceModal}
        initialValues={{
          aliyun_opensearch_hosts:
            initialConfig?.aliyun_opensearch_hosts || '',
          aliyun_opensearch_username:
            initialConfig?.aliyun_opensearch_username || '',
          aliyun_opensearch_password: '',
        }}
      />
    </>
  );
}

export default CloudServiceSection;
