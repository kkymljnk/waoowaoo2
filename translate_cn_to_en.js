// Automated Chinese-to-English translation script
const fs = require('fs');
const path = require('path');

// Translation map: Chinese -> English
const translations = {
    // ===== Common terms =====
    '资产库': 'Asset Library',
    '资产': 'Asset',
    '角色': 'Character',
    '场景': 'Scene',
    '形象': 'Appearance',
    '分镜': 'Storyboard',
    '剧本': 'Script',
    '台词': 'Dialogue',
    '镜头': 'Shot',
    '片段': 'Clip',
    '剧集': 'Episode',
    '音色': 'Voice',
    '配音': 'Dubbing',
    '声音': 'Sound',
    '档案': 'Profile',
    '描述': 'Description',
    '分析': 'Analysis',
    '模型': 'Model',
    '设置': 'Settings',
    '参考图': 'Reference Image',
    '三视图': 'Multi-view Image',
    '提示词': 'Prompt',
    '变体': 'Variant',
    '切片': 'Chunk',
    '全局设定': 'Global Settings',
    '全局资产': 'Global Asset',
    '分集': 'Episode Split',

    // ===== NovelInputStage placeholder =====
    '请输入您的剧本或小说内容...': 'Enter your script or novel content...',
    'AI 将根据您的文本智能分析：': 'AI will intelligently analyze your text:',
    '自动识别场景切换': 'Automatically identify scene transitions',
    '提取角色对话和动作': 'Extract character dialogues and actions',
    '生成分镜脚本': 'Generate storyboard script',
    '例如：': 'For example:',
    '清晨，阳光透过窗帘洒进房间。小明揉着惺忪的睡眼从床上坐起，看了一眼床头的闹钟——已经八点了！他猛地跳下床，手忙脚乱地开始穿衣服...':
        'Early morning, sunlight filtered through the curtains into the room. Xiao Ming rubbed his sleepy eyes and sat up in bed, glancing at the alarm clock on the nightstand — it was already eight! He jumped out of bed and frantically started getting dressed...',

    // ===== Error messages =====
    '请先在设置页面配置分析模型': 'Please configure the analysis model in settings first',
    '请先在项目设置中配置分析模型': 'Please configure the analysis model in project settings first',
    '请先在用户配置中设置分析模型': 'Please configure the analysis model in user settings first',
    '请先填写全局资产设定或剧本内容': 'Please fill in global asset settings or script content first',
    '没有可分析的内容，请先添加剧集或全局设定': 'No content to analyze, please add episodes or global settings first',
    '请先在设置页面配置角色图片模型': 'Please configure character image model in settings first',
    '该镜头还没有生成图片，无法分析变体': 'This shot has no generated image yet, cannot analyze variants',
    '档案数据格式错误': 'Profile data format error',
    '角色缺少档案数据': 'Character missing profile data',
    '没有待确认的角色': 'No characters pending confirmation',
    '图片生成失败': 'Image generation failed',
    '声音设计失败': 'Sound design failed',
    '文本太短，至少需要 100 字': 'Text is too short, minimum 100 characters required',
    'AI 返回为空': 'AI returned empty result',
    'AI返回格式错误: 缺少 appearances': 'AI response format error: missing appearances',
    '分集结果为空': 'Episode split result is empty',
    '分集边界匹配失败': 'Episode boundary matching failed',
    '生成的变体数量不足': 'Insufficient number of variants generated',
    '参考图描述提取完成': 'Reference image description extraction complete',
    '参考图描述提取失败，不影响改图结果': 'Reference image description extraction failed, does not affect result',
    '资产库参考图描述提取失败': 'Asset library reference image description extraction failed',

    // ===== Task status/progress messages =====
    '准备全局资产分析参数': 'Preparing global asset analysis parameters',
    '分析全局资产切片': 'Analyzing global asset chunk',
    '角色分析': 'Character analysis',
    '场景分析': 'Scene analysis',
    '角色分析完成': 'Character analysis complete',
    '场景分析完成': 'Scene analysis complete',
    '全局资产分析完成': 'Global asset analysis complete',
    '资产分析已完成': 'Asset analysis complete',
    '准备资产分析参数': 'Preparing asset analysis parameters',
    '保存资产分析结果': 'Saving asset analysis results',
    '准备资产设计参数': 'Preparing asset design parameters',
    '资产设计结果已生成': 'Asset design results generated',
    '准备资产修改参数': 'Preparing asset modification parameters',
    '角色描述修改': 'Character description modification',
    '场景描述修改': 'Scene description modification',
    '资产修改结果已生成': 'Asset modification results generated',
    '准备角色档案确认参数': 'Preparing character profile confirmation parameters',
    '角色档案确认': 'Character profile confirmation',
    '保存角色档案确认结果': 'Saving character profile confirmation results',
    '角色档案确认完成': 'Character profile confirmation complete',
    '准备批量角色档案确认参数': 'Preparing batch character profile confirmation parameters',
    '批量角色档案确认中': 'Batch character profile confirmation in progress',
    '批量角色档案确认完成': 'Batch character profile confirmation complete',
    '准备片段切分参数': 'Preparing clip segmentation parameters',
    '片段切分': 'Clip segmentation',
    '保存片段切分结果': 'Saving clip segmentation results',
    '片段切分已完成': 'Clip segmentation complete',
    '准备分集参数': 'Preparing episode split parameters',
    '智能分集': 'Smart episode split',
    '解析分集结果': 'Parsing episode split results',
    '匹配剧集内容范围': 'Matching episode content range',
    '智能分集完成': 'Smart episode split complete',
    '准备剧本转换参数': 'Preparing script conversion parameters',
    '执行剧本转换': 'Executing script conversion',
    '剧本转换结果已保存': 'Script conversion results saved',
    '保存模型结果': 'Saving model results',
    '模型输出完成，正在保存结果...': 'Model output complete, saving results...',
    '准备参考图转换参数': 'Preparing reference image conversion parameters',
    '提取参考图描述': 'Extracting reference image description',
    '生成角色三视图': 'Generating character multi-view image',
    '参考图转换完成': 'Reference image conversion complete',
    '准备台词分析参数': 'Preparing dialogue analysis parameters',
    '台词分析': 'Dialogue analysis',
    '保存台词分析结果': 'Saving dialogue analysis results',
    '台词分析结果已保存': 'Dialogue analysis results saved',
    '提交声音设计任务': 'Submitting sound design task',
    '声音设计完成': 'Sound design complete',
    '准备角色描述修改参数': 'Preparing character description modification parameters',
    '角色描述修改完成': 'Character description modification complete',
    '准备场景描述修改参数': 'Preparing scene description modification parameters',
    '场景描述修改完成': 'Scene description modification complete',
    '准备镜头提示词修改参数': 'Preparing shot prompt modification parameters',
    '镜头提示词修改': 'Shot prompt modification',
    '镜头提示词修改完成': 'Shot prompt modification complete',
    '准备镜头变体分析参数': 'Preparing shot variant analysis parameters',
    '镜头变体分析': 'Shot variant analysis',
    '镜头变体分析完成': 'Shot variant analysis complete',
    '插入分镜': 'Insert storyboard panel',
    '镜头变体': 'Shot variant',

    // ===== Misc strings =====
    '无': 'N/A',
    '无描述': 'No description',
    '无角色': 'No characters',
    '无角色外貌数据': 'No character appearance data',
    '无角色参考图': 'No character reference image',
    '无参考图': 'No reference image',
    '已提供参考图': 'Reference image provided',
    '无场景参考': 'No scene reference',
    '无分镜数据': 'No storyboard data',
    '默认形象': 'Default appearance',
    '默认': 'Default',
    '初始形象': 'Initial appearance',
    '中景': 'Medium shot',
    '固定': 'Fixed',
    '未知': 'Unknown',
    '与参考图风格一致': 'Consistent with reference image style',
    '幻想': 'Fantasy',
    '抽象': 'Abstract',
    '无明确': 'Unclear',
    '空间锚点': 'Spatial anchor',
    '未说明': 'Not specified',
    '不明确': 'Unclear',
    '落水湿身': 'Fell into water',
    '新角色 - 初始形象': 'New character - Initial appearance',

    // ===== Prompt-related =====
    '请根据以下指令修改图片，保持人物核心特征一致：': 'Please modify the image according to the following instructions while maintaining core character features:',
    '请根据以下指令修改场景图片，保持整体风格一致：': 'Please modify the scene image according to the following instructions while maintaining consistent style:',
    '请根据以下指令修改分镜图片，保持镜头语言和主体一致：': 'Please modify the storyboard image according to the following instructions while maintaining shot language and subject consistency:',

    // ===== i18n routing comments =====
    '支持的所有语言': 'Supported languages',
    '默认语言': 'Default language',

    // ===== Validation messages =====
    '缺少有效': 'missing valid',
    '缺少': 'missing',
    '必须同时提供': 'must provide both',
    '无法定位': 'cannot locate',
    '与 marker 偏差过大': 'marker deviation too large',
    '边界区间无效': 'boundary range invalid',
    '匹配内容为空': 'matched content is empty',
    '台词分析失败，准备重试': 'Dialogue analysis failed, preparing to retry',
};

const srcDir = path.join(__dirname, 'src');
let totalReplacements = 0;
let totalFiles = 0;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Sort translations by length (longest first) to avoid partial replacements
    const sorted = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);

    for (const [chinese, english] of sorted) {
        if (content.includes(chinese)) {
            content = content.split(chinese).join(english);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        totalFiles++;
        const rel = path.relative(__dirname, filePath);
        console.log(`Updated: ${rel}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (f === 'node_modules' || f === '.next' || f === '.git') continue;
            walkDir(full);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            processFile(full);
        }
    }
}

walkDir(srcDir);
console.log(`\nDone! Updated ${totalFiles} files.`);
