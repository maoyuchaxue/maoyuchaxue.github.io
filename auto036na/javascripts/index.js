var data = {
    lmat: [[0,1,0,0,0,0], [0,0,0,0,0,1], [1,0,0,0,0,0], [0,0,0,1,0,0], [0,0,0,0,1,0], [0,0,1,0,0,0]],
    rmat: [[0,0,0,0,1,0], [0,0,1,0,0,0], [0,0,0,0,0,1], [0,1,0,0,0,0], [1,0,0,0,0,0], [0,0,0,1,0,0]],
    kmat_raw: copy_matrix(basic_matrix),
    deciphering: true,
    cipher_text: "UO CSG ISF2 6STDUT4 JKSD Q3UQ CSG 3UF2 W22K 1MF2K UNN Q32 K252OOUTC QSSNO QS OG55224 M6 CSG 6MK4 CSGTO2N6 OQG5J UK4 UQ U 5SIRN2Q2 NSOO Q32T2 MO U 4MOQT2OO OCOQ2I Q3UQ IUC W2 GQMNME24 HSD2F2T 4G2 QS O25GTMQC TMOJ SGT QTUKOIMOOMSKO IGOQ W2 NMIMQ24",
    plain_text: "",
    is_lmat_unknown: false,
    is_rmat_unknown: false
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

function set_lmat_unknown(val) {
    data.is_lmat_unknown = val;
}

function set_rmat_unknown(val) {
    data.is_rmat_unknown = val;
}

function clear_lmat() {
    data.lmat = copy_matrix(empty_mat);
}

function clear_rmat() {
    data.rmat = copy_matrix(empty_mat);
}

function set_deciphering(deciphering) {
    data.deciphering = deciphering;
}

function set_kmat(transform) {
    switch (transform) {
        case "_":
            data.kmat_raw = copy_matrix(basic_matrix);
            break;
        case "T":
            tmp_mat = copy_matrix(data.kmat_raw);
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 6; j++) {
                    tmp_mat[i][j] = data.kmat_raw[j][i];
                }
            }
            data.kmat_raw = tmp_mat;
            break;
        case "X":
            data.kmat_raw = copy_matrix(nax_matrix);
    }
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
                        kmat[i][j] = this.kmat_raw[i][j].toLowerCase();
                    }
                }
                return kmat;
            },
            maps: function () {
                if (this.is_valid && !this.is_lmat_unknown && !this.is_rmat_unknown) {
                    return map_036na(this.lmat, this.kmat, this.rmat);
                }

                default_bad_map = {};
                for (var i = 0; i < 36; i++) {
                    default_bad_map[keys[i]] = "?";
                }
                return default_bad_map;
            },
            computed_plain_text: function () {
                if (this.is_valid) {
                    if (this.is_both_unknown) {
                        return "cannot solve when both substitution matrixs are unknown"
                    } else {
                        if (this.is_lmat_unknown) {
                            plain_texts = ""
                            for (m in all_matrixs) {
                                lmat = all_matrixs[m];
                                map = map_036na(lmat, this.kmat, this.rmat);
                                
                                plain_texts += decipher_036na(map, this.cipher_text) + "\r\n"; 
                            }
                            return plain_texts;

                        } else if (this.is_rmat_unknown) {
                            plain_texts = ""
                            for (m in all_matrixs) {
                                rmat = all_matrixs[m];
                                map = map_036na(this.lmat, this.kmat, rmat);
                                
                                plain_texts += decipher_036na(map, this.cipher_text) + "\r\n"; 
                            }
                            return plain_texts;

                        } else {

                            return decipher_036na(this.maps, this.cipher_text);
                        }
                    }
                } else {
                    return "invalid 036na"
                }
            },
            computed_cipher_text: function () {
                if (this.is_valid) {
                    if (this.is_both_unknown) {
                        return "cannot solve when both substitution matrixs are unknown"
                    } else {
                        if (this.is_lmat_unknown) {
                            plain_texts = ""
                            for (m in all_matrixs) {
                                lmat = all_matrixs[m];
                                map = map_036na(lmat, this.kmat, this.rmat);
                                
                                plain_texts += cipher_036na(map, this.plain_text); + "\r\n"; 
                            }
                            return plain_texts;

                        } else if (this.is_rmat_unknown) {
                            plain_texts = ""
                            for (m in all_matrixs) {
                                rmat = all_matrixs[m];
                                map = map_036na(this.lmat, this.kmat, rmat);
                                
                                plain_texts += cipher_036na(map, this.plain_text) + "\r\n"; 
                            }
                            return plain_texts;

                        } else {
                            return cipher_036na(this.maps, this.plain_text);
                        }
                    }
                } else {
                    return "invalid 036na"
                }
            },
            is_lmat_valid: function () {
                return this.is_lmat_unknown || check_bin_mat(this.lmat);
            },
            is_rmat_valid: function () {
                return this.is_rmat_unknown ||check_bin_mat(this.rmat);
            },
            is_kmat_valid: function () {
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
            is_kmat_cell_valid: function () {
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
            is_valid: function() {
                return this.is_lmat_valid && this.is_rmat_valid && this.is_kmat_valid;
            },
            is_both_unknown: function() {
                return this.is_lmat_unknown && this.is_rmat_unknown;
            }
        },
        methods: {
            setLMatCheck: set_lmat_check,
            setRMatCheck: set_rmat_check,
            setDeciphering: set_deciphering,
            setLMatUnknown: set_lmat_unknown,
            clearLMat: clear_lmat,
            setRMatUnknown: set_rmat_unknown,
            clearRMat: clear_rmat,
            setKMat: set_kmat
        },
    })
}

