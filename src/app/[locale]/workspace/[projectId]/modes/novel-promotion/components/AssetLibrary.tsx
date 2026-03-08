'use client'

/**
 * Asset Library - 全局浮动按钮,打开后显示完整的Asset管理界面
 * 复用AssetsStage组件,保持功能完全一致
 * 
 * 🔥 V6.5 重构：删除 characters/locations props，AssetsStage 现在内部直接订阅
 * 🔥 V6.6 重构：删除 onGenerateImage prop，AssetsStage 现在内部使用 mutation hooks
 */

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import AssetsStage from './AssetsStage'
import { AppIcon } from '@/components/ui/icons'

interface AssetLibraryProps {
  projectId: string
  isAnalyzingAssets: boolean
}

export default function AssetLibrary({
  projectId,
  isAnalyzingAssets
}: AssetLibraryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('assets')

  return (
    <>
      {/* 触发按钮 - 现代玻璃态风格 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-40 flex items-center gap-2 px-5 py-2.5 glass-btn-base glass-btn-secondary text-[var(--glass-text-secondary)] font-medium"
      >
        <AppIcon name="folderCards" className="w-5 h-5" />
        {t('assetLibrary.button')}
      </button>

      {/* 全屏弹窗 - 现代玻璃态风格 */}
      {isOpen && (
        <div className="fixed inset-0 glass-overlay z-50 flex items-center justify-center p-6">
          <div className="glass-surface-modal w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col overflow-hidden">
            {/* 头部 */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--glass-stroke-base)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--glass-accent-from)] rounded-2xl flex items-center justify-center shadow-[var(--glass-shadow-md)]">
                  <AppIcon name="folderCards" className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--glass-text-primary)]">{t('assetLibrary.title')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 glass-btn-base glass-btn-secondary flex items-center justify-center"
              >
                <AppIcon name="close" className="w-5 h-5 text-[var(--glass-text-tertiary)]" />
              </button>
            </div>

            {/* 内容区域 - 复用AssetsStage，现在 AssetsStage 内部直接订阅和处理图片生成 */}
            <div className="flex-1 overflow-y-auto p-8">
              <AssetsStage
                projectId={projectId}
                isAnalyzingAssets={isAnalyzingAssets}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
