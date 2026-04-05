/**
 * GitHub Deploy Tool
 *
 * GitHub Actions and deployment integration for:
 * - Triggering workflow runs
 * - Checking deployment status
 * - Managing secrets
 * - Repository operations
 */

import { GitHubClient } from './github-client';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = process.env.GITHUB_OWNER || 'jadency';
const REPO = process.env.GITHUB_REPO || 'jadency-social';

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'neutral' | 'skipped' | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  run_number: number;
}

export interface DeploymentStatus {
  id: string;
  environment: string;
  description: string;
  state: 'queued' | 'in_progress' | 'success' | 'failure' | 'cancelled' | 'neutral' | 'timed_out' | 'action_required';
  created_at: string;
  updated_at: string;
  creator: {
    login: string;
  };
}

const client = new GitHubClient({
  token: GITHUB_TOKEN,
  owner: OWNER,
  repo: REPO,
});

/**
 * List workflow runs
 */
export async function listWorkflowRuns(
  workflowName?: string,
  options: { limit?: number; branch?: string } = {}
): Promise<WorkflowRun[]> {
  try {
    const runs = await client.actions.listWorkflowRuns({
      workflow_id: workflowName || 'deploy.yml',
      per_page: options.limit || 20,
      branch: options.branch,
    });

    return runs.workflow_runs.map((run: Record<string, unknown>) => ({
      id: run.id as number,
      name: run.name as string,
      head_branch: run.head_branch as string,
      head_sha: run.head_sha as string,
      status: run.status as 'queued' | 'in_progress' | 'completed',
      conclusion: run.conclusion as 'success' | 'failure' | 'cancelled' | 'neutral' | 'skipped' | null,
      created_at: run.created_at as string,
      updated_at: run.updated_at as string,
      html_url: run.html_url as string,
      run_number: run.run_number as number,
    }));
  } catch (error) {
    console.error('Error listing workflow runs:', error);
    throw error;
  }
}

/**
 * Trigger a workflow dispatch
 */
export async function triggerWorkflow(
  workflowName: string,
  branch: string,
  inputs?: Record<string, string>
): Promise<WorkflowRun> {
  try {
    await client.actions.createWorkflowDispatch({
      workflow_id: workflowName,
      ref: branch,
      inputs: inputs,
    });

    // Wait a moment and get the run
    await new Promise(resolve => setTimeout(resolve, 2000));

    const runs = await listWorkflowRuns(workflowName, { limit: 1, branch });
    return runs[0];
  } catch (error) {
    console.error('Error triggering workflow:', error);
    throw error;
  }
}

/**
 * Get workflow run status
 */
export async function getWorkflowRun(runId: number): Promise<WorkflowRun> {
  try {
    const run = await client.actions.getWorkflowRun({
      run_id: runId,
    });

    return {
      id: run.id,
      name: run.name,
      head_branch: run.head_branch,
      head_sha: run.head_sha,
      status: run.status,
      conclusion: run.conclusion,
      created_at: run.created_at,
      updated_at: run.updated_at,
      html_url: run.html_url,
      run_number: run.run_number,
    };
  } catch (error) {
    console.error('Error getting workflow run:', error);
    throw error;
  }
}

/**
 * Cancel a workflow run
 */
export async function cancelWorkflowRun(runId: number): Promise<void> {
  try {
    await client.actions.cancelWorkflowRun({
      run_id: runId,
    });
  } catch (error) {
    console.error('Error canceling workflow run:', error);
    throw error;
  }
}

/**
 * Get workflow run logs
 */
export async function getWorkflowRunLogs(runId: number): Promise<string> {
  try {
    const logs = await client.actions.downloadWorkflowRunLogs({
      run_id: runId,
    });

    return logs.toString('utf-8');
  } catch (error) {
    console.error('Error getting workflow run logs:', error);
    throw error;
  }
}

/**
 * Get repository info
 */
export async function getRepositoryInfo(): Promise<{
  name: string;
  fullName: string;
  defaultBranch: string;
  url: string;
  updatedAt: string;
}> {
  try {
    const repo = await client.repos.get();

    return {
      name: repo.name,
      fullName: repo.full_name,
      defaultBranch: repo.default_branch,
      url: repo.html_url,
      updatedAt: repo.updated_at,
    };
  } catch (error) {
    console.error('Error getting repository info:', error);
    throw error;
  }
}

/**
 * Get latest deployment
 */
export async function getLatestDeployment(environment: string = 'production'): Promise<DeploymentStatus | null> {
  try {
    const deployments = await client.repos.listDeployments({
      environment,
      per_page: 1,
    });

    if (deployments.length === 0) return null;

    const deployment = deployments[0];
    const statuses = await client.repos.listDeploymentStatuses({
      deployment_id: deployment.id,
    });

    const latestStatus = statuses[0];

    return {
      id: latestStatus.id.toString(),
      environment: deployment.environment,
      description: latestStatus.description || '',
      state: latestStatus.state as DeploymentStatus['state'],
      created_at: latestStatus.created_at,
      updated_at: latestStatus.updated_at,
      creator: latestStatus.creator,
    };
  } catch (error) {
    console.error('Error getting latest deployment:', error);
    throw error;
  }
}

/**
 * Create a deployment
 */
export async function createDeployment(
  environment: string,
  branch: string,
  options: {
    description?: string;
    transientEnvironment?: boolean;
    productionEnvironment?: boolean;
  } = {}
): Promise<{ id: number; url: string }> {
  try {
    const deployment = await client.repos.createDeployment({
      ref: branch,
      environment,
      description: options.description,
      transient_environment: options.transientEnvironment,
      production_environment: options.productionEnvironment,
      auto_merge: false,
    });

    // Create initial status
    await client.repos.createDeploymentStatus({
      deployment_id: deployment.id,
      state: 'in_progress',
      description: 'Deployment started',
      in_progress: true,
    });

    return {
      id: deployment.id,
      url: `https://github.com/${OWNER}/${REPO}/deployments/${environment}`,
    };
  } catch (error) {
    console.error('Error creating deployment:', error);
    throw error;
  }
}

/**
 * Update deployment status
 */
export async function updateDeploymentStatus(
  deploymentId: number,
  state: DeploymentStatus['state'],
  description: string
): Promise<void> {
  try {
    await client.repos.createDeploymentStatus({
      deployment_id: deploymentId,
      state,
      description,
      environment_url: state === 'success' ? process.env.DEPLOY_URL : undefined,
    });
  } catch (error) {
    console.error('Error updating deployment status:', error);
    throw error;
  }
}

/**
 * Wait for workflow completion
 */
export async function waitForWorkflowComplete(
  runId: number,
  timeoutMs: number = 600000 // 10 minutes
): Promise<WorkflowRun> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const run = await getWorkflowRun(runId);

    if (run.status === 'completed') {
      return run;
    }

    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
  }

  throw new Error(`Workflow ${runId} timed out after ${timeoutMs}ms`);
}

export default {
  listWorkflowRuns,
  triggerWorkflow,
  getWorkflowRun,
  cancelWorkflowRun,
  getWorkflowRunLogs,
  getRepositoryInfo,
  getLatestDeployment,
  createDeployment,
  updateDeploymentStatus,
  waitForWorkflowComplete,
};
