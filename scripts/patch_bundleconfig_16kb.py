#!/usr/bin/env python3
"""Patch BundleConfig.pb in an AAB to request PAGE_ALIGNMENT_16K (AGP < 8.5)."""
import os
import sys
import zipfile

OLD = b"\x12\x02\x08\x01"
NEW = b"\x12\x04\x08\x01\x10\x02"


def patch_bundleconfig(data):
    if OLD not in data:
        print("WARNING: UncompressNativeLibraries pattern not found in BundleConfig.pb")
        return data
    pos = data.index(OLD)
    patched = data[:pos] + NEW + data[pos + len(OLD) :]
    ba = bytearray(patched)
    i = 0
    while i < len(ba):
        tag = ba[i]
        field_num = tag >> 3
        wire_type = tag & 0x07
        i += 1
        if wire_type == 2:
            length = 0
            shift = 0
            len_start = i
            while i < len(ba):
                b = ba[i]
                i += 1
                length |= (b & 0x7F) << shift
                shift += 7
                if not (b & 0x80):
                    break
            len_end = i
            body_start = i
            body_end = i + length
            if field_num == 2 and body_start <= pos < body_end:
                new_length = length + 2
                new_len_bytes = []
                val = new_length
                while val > 0x7F:
                    new_len_bytes.append((val & 0x7F) | 0x80)
                    val >>= 7
                new_len_bytes.append(val)
                ba = ba[:len_start] + bytes(new_len_bytes) + ba[len_end:]
                break
            i = body_end
        elif wire_type == 0:
            while i < len(ba) and ba[i] & 0x80:
                i += 1
            i += 1
        elif wire_type == 1:
            i += 8
        elif wire_type == 5:
            i += 4
    return bytes(ba)


def patch_aab(src_path, dst_path):
    with zipfile.ZipFile(src_path, "r") as zin:
        with zipfile.ZipFile(dst_path, "w", allowZip64=True) as zout:
            for info in zin.infolist():
                data = zin.read(info.filename)
                if info.filename == "BundleConfig.pb":
                    data = patch_bundleconfig(data)
                    print("  patched BundleConfig.pb (+PAGE_ALIGNMENT_16K)")
                zout.writestr(info, data)
    print("  output: {}".format(os.path.basename(dst_path)))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: {} <input.aab> <output.aab>".format(sys.argv[0]))
        sys.exit(1)
    patch_aab(sys.argv[1], sys.argv[2])
