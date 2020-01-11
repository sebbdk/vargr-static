# Static
Small and very insecure static file server experiment.

Use you you own risk.

## Console example

```
    node index.js bundles='{"archive":"./archive.zip","test/a":"./testdir"}'
```

## TODO

* Securety concerns?
* Override vs merge folder on zip upload, think site overrides
* Delete command
* Docker?
* Optional Admin GUI
* Optional Client GUI
* Symlink with ~ home folder
* Unit tests
* file/folder info, creation date etc.
* Maintain map and/or use routing instead of symlinks?
* Map folder to port for nginx / domain mapping ?

# DONE
* Console commands
* Initial Code cleanup




File explorer
    - Folder as gallery with sorting
    - Open zip as gallery