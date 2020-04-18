const keys = "1234567890abcdefghijklmnopqrstuvwxyz"

function map_036na(lmat, kmat, rmat) {
    kmat1 = [];
    for (var i = 0; i < 6; i++) {
        kmat1[i] = [];
        for (var j = 0; j < 6; j++) {
            for (var k = 0; k < 6; k++) {
                if (lmat[i][k] == 1) {
                    kmat1[i][j] = kmat[k][j];
                    break;
                }
            }
        }
    }

    kmat2 = [];
    for (var i = 0; i < 6; i++) {
        kmat2[i] = [];
        for (var j = 0; j < 6; j++) {
            for (var k = 0; k < 6; k++) {
                if (rmat[k][j] == 1) {
                    kmat2[i][j] = kmat1[i][k];
                    break;
                }
            }
        }
    }

    map = {};
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            map[kmat[i][j]] = kmat2[i][j];
        }
    }
    return map;
}

function decipher_036na(map, ciphertext) {
    ciphertext = ciphertext.toLowerCase();
    var rev_map = {}
    for (c in map) {
        rev_map[map[c]] = c;
    }

    plaintext = "";
    for (c in ciphertext) {
        c = ciphertext[c];
        if (c in rev_map) {
            plaintext += rev_map[c];
        } else {
            plaintext += c;
        }
    }
    return plaintext;
}

function cipher_036na(map, plaintext) {
    plaintext = plaintext.toLowerCase();
    ciphertext = "";
    for (c in plaintext) {
        c = plaintext[c];
        if (c in map) {
            ciphertext += map[c];
        } else {
            ciphertext += c;
        }
    }
    return ciphertext;
}