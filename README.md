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
* Code cleanup
* Unit tests
* Maintain map and/or use routing instead of symlinks?
* Map folder to port for nginx / domain mapping ?

# DONE
* Console commands