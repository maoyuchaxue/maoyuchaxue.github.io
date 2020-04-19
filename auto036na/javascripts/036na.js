const keys = "1234567890abcdefghijklmnopqrstuvwxyz"

basic_matrix = [["1", "2", "3", "4", "5", "6"], ["7", "8", "9", "0", "a", "b"], ["c", "d", "e", "f", "g", "h"], ["i", "j", "k", "l", "m", "n"], ["o", "p", "q", "r", "s", "t"], ["u", "v", "w", "x", "y", "z"]]

empty_mat = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
all_matrixs = [];

function copy_matrix(mat) {
    new_mat = [];
    for (var i in mat) {
        new_mat.push(mat[i].slice());
    }
    return new_mat;
}

function generate_all_matrixs() {
    const permutator = (inputArr) => {
        // https://stackoverflow.com/questions/9960908/permutations-in-javascript
        let result = [];
      
        const permute = (arr, m = []) => {
          if (arr.length === 0) {
            result.push(m)
          } else {
            for (let i = 0; i < arr.length; i++) {
              let curr = arr.slice();
              let next = curr.splice(i, 1);
              permute(curr.slice(), m.concat(next))
           }
         }
       }
      
       permute(inputArr)
      
       return result;
    }

    perms = permutator([0,1,2,3,4,5]);
    for (var p in perms) {
        mat = copy_matrix(empty_mat);
        for (var i = 0; i < 6; i++) {
            mat[i][perms[p][i]] = 1;
        }
        all_matrixs.push(mat);
    }
}

generate_all_matrixs();

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