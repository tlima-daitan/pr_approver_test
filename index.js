import github, { context } from '@actions/github';
import { getInput, setFailed } from '@actions/core';

const main = async () => {
  const token = getInput('token');
  const label = getInput('target-label');
  const octokit = github.getOctokit(token);

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
