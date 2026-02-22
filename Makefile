setup:
	./scripts/setup.sh

build:
	npm run build:chrome
	npm run build:firefox

package:
	npm run package

deploy-local:
	./scripts/deploy-local.sh

tag:
	@echo "Use: ./scripts/release-tag.sh vX.Y.Z"
