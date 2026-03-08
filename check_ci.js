const https = require('https');
const opts = { headers: { 'User-Agent': 'node.js', 'Accept': 'application/vnd.github.v3+json' } };

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, opts, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function main() {
    const runs = await get('https://api.github.com/repos/kkymljnk/waoowaoo2/actions/runs?per_page=1');
    const run = runs.workflow_runs[0];
    console.log('Run:', run.head_commit?.message?.split('\n')[0]);
    console.log('Status:', run.status, '/', run.conclusion);

    const jobs = await get(run.jobs_url);
    for (const job of jobs.jobs) {
        console.log('\nJob:', job.name, '-', job.conclusion);
        for (const step of job.steps) {
            if (step.conclusion === 'failure') {
                console.log('  FAILED Step:', step.name, '(#' + step.number + ')');
            }
        }
    }

    // Get log download URL
    const logUrl = `https://api.github.com/repos/kkymljnk/waoowaoo2/actions/runs/${run.id}/logs`;
    console.log('\nLog URL:', logUrl);
    console.log('Run ID:', run.id);
    console.log('Run URL:', run.html_url);
}

main().catch(console.error);
