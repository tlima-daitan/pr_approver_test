const github = require('@actions/github');
const core = require('@actions/core');

const main = async () => {
  const token = core.getInput('token');
  const approvalLabelsString = core.getInput('label-list');
  const exclusionLabelsString = core.getInput('label-exclusion-list');
  const octokit = github.getOctokit(token);

  const { pull_request } = github.context.payload;
  const { number, labels } = pull_request;

  const prLabels = labels.map(label => label.name);
  const approvalLabels = approvalLabelsString.split(',');
  const exclusionLabels = (exclusionLabelsString && exclusionLabelsString.split(',')) || [];

  console.log('\n\n### ~~^~~ ~~^~~ ~~^~~ ~~^~~ ~~^~~ ~~^~~ ~~^~~ ###');
  console.log('labels: ', labels);
  console.log('prLabels: ', prLabels);
  console.log('approvalLabels: ', approvalLabels);
  console.log('exclusionLabels: ', exclusionLabels);
  console.log('### ~~@~~ ~~@~~ ~~@~~ ~~@~~ ~~@~~ ~~@~~ ~~@~~ ###\n\n');

  if (
    exclusionLabels.filter(exclusionLabel => prLabels.includes(exclusionLabel)).length === 0
    && approvalLabels.filter(approvalLabel => prLabels.includes(approvalLabel)).length > 0
  ) {
    await octokit.rest.pulls.createReview({
      ...github.context.repo,
      pull_number: number,
      event: 'APPROVE'
    });
  }
};

main().catch(err => core.setFailed(err.message));
