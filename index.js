const github = require('@actions/github');
const core = require('@actions/core');

const main = async () => {
  const token = core.getInput('token');
  const label = core.getInput('target-label');
  const octokit = github.getOctokit(token);

  const { pull_request } = github.context.payload;
  const { number, labels } = pull_request;

  const labelsList = labels.map(label => label.name);

  if (labelsList.includes(label)) {
    const approvePayload = {
      ...github.context.repo,
      pull_number: Number.parseInt(number, 10),
      event: 'APPROVE'
    }
    console.log('approvePayload:', approvePayload);
    await octokit.rest.pulls.submitReview(approvePayload)
  }

};

main().catch(err => core.setFailed(err.message));
