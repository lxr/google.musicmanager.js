google-musicmanager.js: LICENSE-MIT $(shell find src -name '*.js')
	awk -f build.awk LICENSE-MIT src/index.js > $@

clean:
	rm -f google-musicmanager.js

.PHONY: clean
