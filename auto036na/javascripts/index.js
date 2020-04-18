var data = {
    lmat: [[0,1,0,0,0,0], [0,0,0,0,0,1], [1,0,0,0,0,0], [0,0,0,1,0,0], [0,0,0,0,1,0], [0,0,1,0,0,0]],
    rmat: [[0,0,0,0,1,0], [0,0,1,0,0,0], [0,0,0,0,0,1], [0,1,0,0,0,0], [1,0,0,0,0,0], [0,0,0,1,0,0]],
    kmatraw: [["1", "2", "3", "4", "5", "6"], ["7", "8", "9", "0", "a", "b"], ["c", "d", "e", "f", "g", "h"], ["i", "j", "k", "l", "m", "n"], ["o", "p", "q", "r", "s", "t"], ["u", "v", "w", "x", "y", "z"]],
    deciphering: true,
    ciphertext: "UO CSG ISF2 6STDUT4 JKSD Q3UQ CSG 3UF2 W22K 1MF2K UNN Q32 K252OOUTC QSSNO QS OG55224 M6 CSG 6MK4 CSGTO2N6 OQG5J UK4 UQ U 5SIRN2Q2 NSOO Q32T2 MO U 4MOQT2OO OCOQ2I Q3UQ IUC W2 GQMNME24 HSD2F2T 4G2 QS O25GTMQC TMOJ SGT QTUKOIMOOMSKO IGOQ W2 NMIMQ24",
    plaintext: ""
}

function set_lmat_check(row, col, check) {
    tmp_row = data.lmat[row];
    tmp_row.splice(col, 1, check);
    data.lmat.splice(row, 1, tmp_row);
    data.lmat = data.lmat;
}

function set_rmat_check(row, col, check) {
    tmp_row = data.rmat[row];
    tmp_row.splice(col, 1, check);
    data.rmat.splice(row, 1, tmp_row);
    data.rmat = data.rmat;
}

function set_deciphering(deciphering) {
    data.deciphering = deciphering;
}

function check_bin_mat(mat) {
    for (var i = 0; i < 6; i++) {
        var col_sum = 0;
        var row_sum = 0;
        for (var j = 0; j < 6; j++) {
            row_sum += mat[i][j];
            col_sum += mat[j][i];
        }
        if (row_sum != 1 || col_sum != 1) return false;
    }
    return true;
}

index = function() {
    var vm = new Vue({
        el: '#root',
        data: data,
        computed: {
            kmat: function () {
                var kmat = [];
                for (var i = 0; i < 6; i++) {
                    kmat[i] = [];
                    for (var j = 0; j < 6; j++) {
                        kmat[i][j] = this.kmatraw[i][j].toLowerCase();
                    }
                }
                return kmat;
            },
            maps: function () {
                if (this.isvalid) {
                    return map_036na(this.lmat, this.kmat, this.rmat);
                }

                default_bad_map = {};
                for (var i = 0; i < 36; i++) {
                    default_bad_map[keys[i]] = "?";
                }
                return default_bad_map;
            },
            computedplaintext: function () {
                if (this.isvalid) {
                    return decipher_036na(this.maps, this.ciphertext);
                } else {
                    return "invalid 036na"
                }
            },
            computedciphertext: function () {
                if (this.isvalid) {
                    return cipher_036na(this.maps, this.plaintext);
                } else {
                    return "invalid 036na"
                }
            },
            islmatvalid: function () {
                return check_bin_mat(this.lmat);
            },
            isrmatvalid: function () {
                return check_bin_mat(this.rmat);
            },
            iskmatvalid: function () {
                var char_set = new Set();
                for (var i = 0; i < 6; i++) {
                    for (var j = 0; j < 6; j++) {
                        char_set.add(this.kmat[i][j]);
                    }
                }

                for (var i = 0; i < 36; i++) {
                    if (!char_set.has(keys[i])) {
                        return false;
                    }
                }
                return true;
            },
            iskmatcellvalid: function () {
                valid_arr = [];
                for (var i = 0; i < 6; i++) {
                    valid_arr[i] = [];
                    for (var j = 0; j < 6; j++) {
                        valid_arr[i][j] = true;
                    }
                }

                var char_set = new Set(keys);
                for (var i = 0; i < 6; i++) {
                    for (var j = 0; j < 6; j++) {
                        if (!char_set.has(this.kmat[i][j])) {
                            valid_arr[i][j] = false;
                        }
                    }
                }
                for (var k in keys) {
                    inds = [];
                    for (var i = 0; i < 6; i++) {
                        for (var j = 0; j < 6; j++) {
                            if (this.kmat[i][j] == keys[k]) {
                                inds.push([i, j]);
                            }
                        }
                    }
                    if (inds.length > 1) {
                        for (var i in inds) {
                            valid_arr[inds[i][0]][inds[i][1]] = false;
                        }
                    }
                }

                return valid_arr;
            },
            isvalid: function() {
                return this.islmatvalid && this.isrmatvalid && this.iskmatvalid;
            }
        },
        methods: {
            setLMatCheck: set_lmat_check,
            setRMatCheck: set_rmat_check,
            setDeciphering: set_deciphering
        },
    })
}

