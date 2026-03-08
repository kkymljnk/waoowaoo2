const https = require('https');
const options = {
    headers: {
        'User-Agent': 'node.js',
        'Accept': 'application/vnd.github.v3+json'
    }
};
https.get('https://api.github.com/repos/kkymljnk/-waoowaoo-english-ui/actions/runs?per_page=1', options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const runs = JSON.parse(data);
        const jobsUrl = runs.workflow_runs[0].jobs_url;
        https.get(jobsUrl, options, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
                const jobs = JSON.parse(data2);
                const steps = jobs.jobs[0].steps;
                const failedStep = steps.find(s => s.conclusion === 'failure');
                console.log("Failed Step: ", failedStep?.name);
            });
        });
    });
});
