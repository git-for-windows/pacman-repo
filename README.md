# Git for Windows' Pacman repository

This is Git for Windows' [Pacman](https://pacman.archlinux.page/) repository. It hosts the packages Git for Windows builds itself; All other packages used by Git for Windows come from [the MSYS2 project](https://msys2.org/). For more details, see the documentation of [Git for Windows' architecture](https://github.com/git-for-windows/git/blob/main/ARCHITECTURE.md#a-software-distribution-really).

Git for Windows uses branches in this here repository to serve these files: The [`x86_64`](https://github.com/git-for-windows/pacman-repo/tree/x86_64), [`aarch64`](https://github.com/git-for-windows/pacman-repo/tree/aarch64) and [`i686`](https://github.com/git-for-windows/pacman-repo/tree/i686) branches contain the package databases, corresponding package archives, and correspondig PGP signatures, of the latest package versions.

## Layout

Pacman repositories consist of a package database (essentially, a compressed tar archive named `<name>.db`, which contains directories reflecting the current package versions), accompanied by the corresponding `.pkg.tar.xz` files in the same directory, plus all of the corresponding `.sig` files containing PGP signatures.

This layout is best served by a static website, but requires some sort of atomic update of the `.db`/`.db.sig` pair.

That is why the Git for Windows project settled on using Git branches: Their updates are atomic.

## Pacman configuration

Git for Windows' Pacman repository needs to be configured in `/etc/pacman.conf`. The exact configuration is specific to the involved CPU architectures. For example, a regular `x86_64` configuration would look like this:

```ini
[git-for-windows-x86_64]
Server = https://raw.githubusercontent.com/git-for-windows/pacman-repo/refs/heads/x86_64

[git-for-windows-mingw32]
Server = https://raw.githubusercontent.com/git-for-windows/pacman-repo/refs/heads/i686
```

### MSYS vs MINGW package databases

The reason for the split is that any given MSYS2 installation can target only one CPU architecture with its MSYS packages, the architecture targeted by its MSYS2 runtime (i.e. `/usr/bin/msys-2.0.dll`). For the MINGW packages, however, multiple architectures can be targeted.

To allow for that, each branch in this repository actually contains _two_ package databases, one (named `git-for-windows-<architecture>.db`, e.g. `git-for-windows-x86_64.db`) that contains both MSYS and MINGW packages targeting said CPU architecture, and the other one (named `git-for-windows-<msystem>.db`, e.g. `git-for-windows-mingw64.db`) that only contains the MINGW packages.

## Superseded package versions

One important function a Pacman repository serves is to allow users to downgrade by downloading package archives for versions that are now obsolete. While it is typically not possible to list the files served on a static site (Git for Windows' original Pacman repository that was hosted on Azure Blobs, for example, did not have any way to list those) the naming scheme is consistent enough to allow for "guessing" the correct URL: All one needs is to know the correct version number.

With above-mentioned branches, this kind of list is not supported: Only the latest package versions' archives are in the tip revision.

To help with that, for each deployment there is a [GitHub Release](https://github.com/git-for-windows/pacman-repo/releases) whose name reflects the time of said deployment. These GitHub Releases contain the package archives and the package databases, together with the corresponding PGP signatures, that were part of the deployment.

For historical deployments that had not been made to this here Pacman repository (before Git for Windows switched away from hosting packages on Azure Blobs), only the package archives are available, as the exact package databases have been lost to the past.

## Deployments

The packages are deployed exclusively via automation in https://github.com/git-for-windows/git-for-windows-automation/, namely [the `git-artifacts` workflow](https://github.com/git-for-windows/git-for-windows-automation/actions/workflows/git-artifacts.yml) for `mingw-w64-git` (as part of regular Git for Windows releases) and [the `build-and-deploy` workflow](https://github.com/git-for-windows/git-for-windows-automation/actions/workflows/build-and-deploy.yml) for all other packages.
