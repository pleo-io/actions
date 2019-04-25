# Gradle setup action

Setups gradle.

## Usage

```
action "gradle setup" {
  uses = "pleo-io/actions/gradle_setup@master"

  env = {
      MAVEN_REPOSITORY_USER_KEY = "mavenUser"
      MAVEN_REPOSITORY_USER = "your_user"
      MAVEN_REPOSITORY_PASSWORD_KEY = "mavenPassword"
  }

  secrets = ["MAVEN_REPOSITORY_PASSWORD"]
}
```

This will output a file in `$GITHUB_WORKSPACE` looking like this

```
org.gradle.parallel=true
org.gradle.daemon=false
mavenUser=deployments_gradle
mavenPassword=[FILTERED]
```