```
      - uses: ./github_deploy
        with:
           github_app_private_key: ${{ secrets.GITHUB_DEPLOY_APP_PRIVATE_KEY }}
           deploy_environment: production
           deploy_ref: master #optional will be current ref otherwise
```