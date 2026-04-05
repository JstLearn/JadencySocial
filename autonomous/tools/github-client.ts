/**
 * GitHub Client
 *
 * Simple wrapper for GitHub REST API v3
 */

import axios, { AxiosInstance } from 'axios';

export interface GitHubClientConfig {
  token: string;
  owner: string;
  repo: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  run_number: number;
}

export interface Deployment {
  id: number;
  environment: string;
  description: string | null;
  payload: unknown;
  created_at: string;
  updated_at: string;
}

export interface DeploymentStatus {
  id: number;
  state: string;
  description: string | null;
  environment: string | null;
  creator: {
    login: string;
  };
  created_at: string;
  updated_at: string;
}

export class GitHubClient {
  private client: AxiosInstance;
  private owner: string;
  private repo: string;

  constructor(config: GitHubClientConfig) {
    this.owner = config.owner;
    this.repo = config.repo;

    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    });
  }

  // Repository
  readonly repos = {
    get: async () => {
      const response = await this.client.get(`/repos/${this.owner}/${this.repo}`);
      return response.data;
    },

    listDeployments: async (params?: {
      environment?: string;
      per_page?: number;
    }) => {
      const response = await this.client.get(
        `/repos/${this.owner}/${this.repo}/deployments`,
        { params }
      );
      return response.data as Deployment[];
    },

    listDeploymentStatuses: async (params: {
      deployment_id: number;
    }) => {
      const response = await this.client.get(
        `/repos/${this.owner}/${this.repo}/deployments/${params.deployment_id}/statuses`
      );
      return response.data as DeploymentStatus[];
    },

    createDeployment: async (data: {
      ref: string;
      environment?: string;
      description?: string;
      transient_environment?: boolean;
      production_environment?: boolean;
      auto_merge?: boolean;
    }) => {
      const response = await this.client.post(
        `/repos/${this.owner}/${this.repo}/deployments`,
        data
      );
      return response.data as Deployment;
    },

    createDeploymentStatus: async (data: {
      deployment_id: number;
      state: string;
      description?: string;
      environment_url?: string;
      in_progress?: boolean;
    }) => {
      const response = await this.client.post(
        `/repos/${this.owner}/${this.repo}/deployments/${data.deployment_id}/statuses`,
        {
          state: data.state,
          description: data.description,
          environment_url: data.environment_url,
          in_progress: data.in_progress,
        }
      );
      return response.data as DeploymentStatus;
    },
  };

  // Actions
  readonly actions = {
    listWorkflowRuns: async (params: {
      workflow_id: string;
      per_page?: number;
      branch?: string;
    }) => {
      const response = await this.client.get(
        `/repos/${this.owner}/${this.repo}/actions/workflows/${params.workflow_id}/runs`,
        { params: { per_page: params.per_page, branch: params.branch } }
      );
      return response.data;
    },

    getWorkflowRun: async (params: { run_id: number }) => {
      const response = await this.client.get(
        `/repos/${this.owner}/${this.repo}/actions/runs/${params.run_id}`
      );
      return response.data;
    },

    createWorkflowDispatch: async (data: {
      workflow_id: string;
      ref: string;
      inputs?: Record<string, string>;
    }) => {
      await this.client.post(
        `/repos/${this.owner}/${this.repo}/actions/workflows/${data.workflow_id}/dispatches`,
        {
          ref: data.ref,
          inputs: data.inputs,
        }
      );
    },

    cancelWorkflowRun: async (params: { run_id: number }) => {
      await this.client.post(
        `/repos/${this.owner}/${this.repo}/actions/runs/${params.run_id}/cancel`
      );
    },

    downloadWorkflowRunLogs: async (params: { run_id: number }) => {
      const response = await this.client.get(
        `/repos/${this.owner}/${this.repo}/actions/runs/${params.run_id}/logs`,
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(response.data);
    },
  };
}

export default GitHubClient;
