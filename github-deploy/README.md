```
      - uses: pleo-io/actions/github-deploy
        with:
           github_app_private_key: ${{ secrets.GITHUB_DEPLOY_APP_PRIVATE_KEY }}
           deploy_environment: production
           deploy_payload: {} #optional will add custom payload
           deploy_ref: master #optional will be current ref otherwise
           auto_merge: false #optional and defaults to true
```
