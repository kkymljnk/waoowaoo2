/**
 * Mutations 模块导出
 */

// ==================== Asset Hub (Global Asset) ====================
export {
    // Character相关
    useGenerateCharacterImage,
    useModifyCharacterImage,
    useSelectCharacterImage,
    useUndoCharacterImage,
    useUploadCharacterImage,
    useDeleteCharacter,
    useDeleteCharacterAppearance,
    useUploadCharacterVoice,
    // Scene相关
    useGenerateLocationImage,
    useModifyLocationImage,
    useSelectLocationImage,
    useUndoLocationImage,
    useUploadLocationImage,
    useDeleteLocation,
    // Voice相关
    useDeleteVoice,
    // 编辑相关
    useUpdateCharacterName,
    useUpdateLocationName,
    useUpdateCharacterAppearanceDescription,
    useUpdateLocationSummary,
    useAiModifyCharacterDescription,
    useAiModifyLocationDescription,
    useUploadAssetHubTempMedia,
    useAiDesignCharacter,
    useExtractAssetHubReferenceCharacterDescription,
    useCreateAssetHubCharacter,
} from './useAssetHubMutations'

// ==================== Project (项目Asset) ====================
export * from './useCharacterMutations'
export * from './useLocationMutations'
export * from './useStoryboardMutations'
export * from './useVideoMutations'
export * from './useVoiceMutations'
export * from './useProjectConfigMutations'
export * from './useEpisodeMutations'
