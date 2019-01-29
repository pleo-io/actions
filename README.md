# actions

Pleo collection of useful utilities for interacting with GitHub Actions.

## Usage

Usage information for individual commands can be found in their respective directories.

## Development

If you are creating a new action.

1. Copy `action_template.mk` into the sub-folder of each of your actions, and rename it to `Makefile`.
1. For each of your actions, update the new `Makefile` to:
    1. Use the `include` directives for any of the helper files that make sense for your Action.
    1. Set the target depedencies for each of the default targets that make sense for your Action.
    1. Add any additional actions that you would like performed to the target definitions.
    1. If you leave everything for the target blank, it will be skipped, but don't delete it or you will get errors.
1. Optionally: update your Makefile to represent the Docker image name that you would like.  If none is specified the directory name will be used by default.
    1. Add `IMAGE_NAME=<action_name>` to each Action's Makefile. Replace `<action_name` with the name of the image to publish.

## License

[MIT](LICENSE). Please see additional information in each subdirectory.
