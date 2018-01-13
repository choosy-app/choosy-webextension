VERSION = $(shell ruby -r json -e 'puts JSON.load(File.read("src/manifest.json")).fetch("version")')
SOURCES = $(wildcard src/*)

.PHONY: release

release: pkg/choosy-$(VERSION).zip

pkg/choosy-$(VERSION).zip: $(SOURCES)
	cd src && zip -r ../$@ . -x \*.DS_Store
