google.musicmanager.js: LICENSE $(shell find src -name '*.js')
	awk -f build.awk LICENSE src/index.js > $@

clean:
	rm -f google.musicmanager.js

.PHONY: clean
