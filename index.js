const github = require('@actions/github');
const core = require('@actions/core');

const main = async () => {
  const token = core.getInput('token');
  const approvalLabels = core.getInput('label-list');
  const exclusionLabels = core.getInput('label-exclusion-list');
  const octokit = github.getOctokit(token);

  const { pull_request } = github.context.payload;
  const { number, labels } = pull_request;

  const labelsList = labels.map(label => label.name);

  console.log('\n\n### ~~^~~ ~~^~~ ~~^~~ ~~^~~ ~~^~~ ~~^~~ ~~^~~ ###');
  console.log(approvalLabels);
  console.log(exclusionLabels);
  console.log('### ~~@~~ ~~@~~ ~~@~~ ~~@~~ ~~@~~ ~~@~~ ~~@~~ ###\n\n');

  if (Array.isArray(exclusionLabels) && exclusionLabels.filter(exclusionLabel => labelsList.includes(exclusionLabel)).length > 0) return;

  if (approvalLabels.filter(approvalLabel => labelsList.includes(approvalLabel))) {
    await octokit.rest.pulls.createReview({
      ...github.context.repo,
      pull_number: number,
      event: 'APPROVE'
    });
  }
};

main().catch(err => core.setFailed(err.message));
