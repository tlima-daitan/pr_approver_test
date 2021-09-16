const github = require('@actions/github');
const core = require('@actions/core');

const main = async () => {
  const token = core.getInput('token');
  const label = core.getInput('target-label');
  const octokit = github.getOctokit(token);

  const { pull_request } = github.context.payload;
  const { number, labels } = pull_request;

  const labelsList = labels.map(label => label.name);

  console.log('label:', label);
  console.log('number:', number);
  console.log('labelsList:', labelsList);
  console.log('labelsList.includes(label):', labelsList.includes(label));

  if (labelsList.includes(label)) {
    await octokit.rest.pulls.submitReview({
      ...github.context.repo,
      pull_number: number,
      event: 'APPROVE'
    })
  }

};

main().catch(err => core.setFailed(err.message));
