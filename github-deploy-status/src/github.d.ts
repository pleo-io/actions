declare module "@octokit/graphql" {
  export interface Variables {
    [key: string]: string | {};
    headers: {
      [key: string]: string;
    };
  }

  export interface GraphQlQueryResponse {
    (query: string, options: Partial<Variables>): Promise<any>;
  }
}
