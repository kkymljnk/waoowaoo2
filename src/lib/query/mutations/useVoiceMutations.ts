import { useMutation } from '@tanstack/react-query'
import { resolveTaskResponse } from '@/lib/task/client'
import {
    requestBlobWithError,
    requestJsonWithError,
    requestTaskResponseWithError,
    requestVoidWithError,
} from './mutation-shared'

type ProjectVoiceLine = {
    id: string
    lineIndex: number
    speaker: string
    content: string
    emotionPrompt: string | null
    emotionStrength: number | null
    audioUrl: string | null
    lineTaskRunning: boolean
    matchedPanelId?: string | null
    matchedStoryboardId?: string | null
    matchedPanelIndex?: number | null
}

type SpeakerVoiceConfig = {
    voiceType: string
    voiceId?: string
    audioUrl: string
}

type GenerateProjectVoiceResponse = {
    success?: boolean
    async?: boolean
    taskId?: string
    taskIds?: string[]
    total?: number
    error?: string
    results?: Array<{ audioUrl?: string }>
}

export function useDesignProjectVoice(projectId: string) {
    return useMutation({
        mutationFn: async (payload: {
            voicePrompt: string
            previewText: string
            preferredName: string
            language: 'zh'
        }) => {
            const response = await requestTaskResponseWithError(
                `/api/novel-promotion/${projectId}/voice-design`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                },
                'Failed to design voice',
            )
            return await resolveTaskResponse<{
                success?: boolean
                voiceId?: string
                targetModel?: string
                audioBase64?: string
                requestId?: string
            }>(response)
        },
    })
}

/**
 * AnalysisShot variant（项目）
 */

export function useFetchProjectVoiceStageData(projectId: string) {
    return useMutation({
        mutationFn: async ({ episodeId }: { episodeId: string }): Promise<{
            voiceLines: ProjectVoiceLine[]
            speakerVoices: Record<string, SpeakerVoiceConfig>
            speakers: string[]
        }> => {
            const [linesData, voicesData, speakersData] = await Promise.all([
                requestJsonWithError<{ voiceLines?: ProjectVoiceLine[] }>(
                    `/api/novel-promotion/${projectId}/voice-lines?episodeId=${episodeId}`,
                    { method: 'GET' },
                    '获取Dialogue失败',
                ),
                requestJsonWithError<{ speakerVoices?: Record<string, SpeakerVoiceConfig> }>(
                    `/api/novel-promotion/${projectId}/speaker-voice?episodeId=${episodeId}`,
                    { method: 'GET' },
                    '获取CharacterVoice失败',
                ),
                requestJsonWithError<{ speakers?: string[] }>(
                    `/api/novel-promotion/${projectId}/voice-lines?speakersOnly=1`,
                    { method: 'GET' },
                    '获取说话人失败',
                ),
            ])

            return {
                voiceLines: linesData.voiceLines || [],
                speakerVoices: voicesData.speakerVoices || {},
                speakers: speakersData.speakers || [],
            }
        },
    })
}

/**
 * AnalysisDubbingDialogue
 */

export function useAnalyzeProjectVoice(projectId: string) {
    return useMutation({
        mutationFn: async ({ episodeId }: { episodeId: string }) => {
            const response = await requestTaskResponseWithError(
                `/api/novel-promotion/${projectId}/voice-analyze`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ episodeId, async: true }),
                },
                'voice analyze failed',
            )
            return resolveTaskResponse(response)
        },
    })
}

/**
 * 生成单条/批量Dubbing
 */

export function useGenerateProjectVoice(projectId: string) {
    return useMutation({
        mutationFn: async ({
            episodeId,
            lineId,
            all,
        }: {
            episodeId: string
            lineId?: string
            all?: boolean
        }) =>
            await requestJsonWithError<GenerateProjectVoiceResponse>(
                `/api/novel-promotion/${projectId}/voice-generate`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(all ? { episodeId, all: true } : { episodeId, lineId }),
                },
                'voice generate failed',
            ),
    })
}

/**
 * 创建Dialogue
 */

export function useCreateProjectVoiceLine(projectId: string) {
    return useMutation({
        mutationFn: async (payload: {
            episodeId: string
            content: string
            speaker: string
            matchedPanelId?: string | null
        }) =>
            await requestJsonWithError<{ voiceLine: ProjectVoiceLine }>(
                `/api/novel-promotion/${projectId}/voice-lines`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                },
                'add failed',
            ),
    })
}

/**
 * 更新Dialogue字段
 */

export function useUpdateProjectVoiceLine(projectId: string) {
    return useMutation({
        mutationFn: async (payload: Record<string, unknown>) =>
            await requestJsonWithError<{ voiceLine: ProjectVoiceLine }>(
                `/api/novel-promotion/${projectId}/voice-lines`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                },
                'update failed',
            ),
    })
}

/**
 * 删除Dialogue
 */

export function useDeleteProjectVoiceLine(projectId: string) {
    return useMutation({
        mutationFn: async ({ lineId }: { lineId: string }) => {
            await requestVoidWithError(
                `/api/novel-promotion/${projectId}/voice-lines?lineId=${lineId}`,
                { method: 'DELETE' },
                'delete failed',
            )
            return null
        },
    })
}

/**
 * 下载Dubbing zip
 */

export function useDownloadProjectVoices(projectId: string) {
    return useMutation({
        mutationFn: async ({ episodeId }: { episodeId: string }) =>
            await requestBlobWithError(
                `/api/novel-promotion/${projectId}/download-voices?episodeId=${episodeId}`,
                { method: 'GET' },
                'download failed',
            ),
    })
}

/**
 * 为发言人直接SettingsVoice（写入 episode.speakerVoices）
 * 用于不在Asset Library中的Character在Dubbing阶段内联绑定Voice
 */
export function useUpdateSpeakerVoice(projectId: string) {
    return useMutation({
        mutationFn: async (payload: {
            episodeId: string
            speaker: string
            audioUrl: string
            voiceType?: string
            voiceId?: string
        }) =>
            await requestJsonWithError<{ success: boolean }>(
                `/api/novel-promotion/${projectId}/speaker-voice`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                },
                'update speaker voice failed',
            ),
    })
}
