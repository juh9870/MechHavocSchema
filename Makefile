.PHONY: generate_raws
generate_raws:
	deno --allow-write=outputs --allow-read=inputs schema.ts