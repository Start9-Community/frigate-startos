# overrides to s9pk.mk must precede the include statement
ARCHES := x86 arm
TARGETS := generic nvidia amd

include s9pk.mk

.PHONY += generic nvidia amd

generic: ; VARIANT=generic $(MAKE) arches
nvidia:  ; VARIANT=nvidia  $(MAKE) arches ARCHES=x86
amd:     ; VARIANT=amd     $(MAKE) arches ARCHES=x86
