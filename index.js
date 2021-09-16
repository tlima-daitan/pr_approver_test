const github = require('@actions/github');
const core = require('@actions/core');

const main = async () => {
  const token = core.getInput('token');
  const label = core.getInput('target-label');
  const octokit = github.getOctokit(token);
  const { context } = github;


  const { payload: pull_request } = context;
  const { number, labels } = pull_request;

  const labelsList = labels.map(label => label.name);

  if (labelsList.includes(label)) {
    await octokit.rest.pulls.createReview({
      ...context.repo,
      pull_number: number,
      event: 'APPROVE'
    });
  }
};

main().catch(err => setFailed(err.message));
