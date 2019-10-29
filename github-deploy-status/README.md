```
      - uses: pleo-io/actions/github-deploy-status
        with:
           githubToken: ${{ secrets.GITHUB_TOKEN }}
           deploymentId: 12452
           deploymentState: "in_progress"
```
